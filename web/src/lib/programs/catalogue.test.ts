import { describe, expect, it } from "vitest";
import { shapeCatalogue, type RawCohort, type RawCourse } from "./catalogue";

const now = new Date("2026-12-01T00:00:00.000Z");

const course = (overrides: Partial<RawCourse> = {}): RawCourse => ({
  id: 1,
  slug: "social-media-marketing",
  title: "Social Media Marketing",
  summary: "Summary.",
  amount: 80000,
  currency: "GHS",
  status: "published",
  ...overrides,
});

const cohort = (overrides: Partial<RawCohort> = {}): RawCohort => ({
  id: 10,
  course: 1,
  name: "January cohort",
  startsAt: "2027-01-10T09:00:00.000Z",
  seats: 20,
  status: "open",
  ...overrides,
});

const staffOnlyFields = {
  seats: 99,
  meetingUrl: "https://meet.example/secret",
  trainers: [1],
  resources: [{ label: "x", url: "y" }],
  programKey: "smm",
};

describe("shapeCatalogue", () => {
  it("excludes non-published courses", () => {
    const result = shapeCatalogue(
      {
        courses: [course(), course({ id: 2, slug: "soon", status: "coming-soon" }), course({ id: 3, slug: "d", status: "draft" })],
        cohorts: [],
        oneOnOne: null,
      },
      now,
    );
    expect(result.courses.map((c) => c.course.slug)).toEqual(["social-media-marketing"]);
  });

  it("sorts courses by title", () => {
    const result = shapeCatalogue(
      { courses: [course({ id: 2, slug: "b", title: "Beta" }), course({ id: 3, slug: "a", title: "Alpha" })], cohorts: [], oneOnOne: null },
      now,
    );
    expect(result.courses.map((c) => c.course.title)).toEqual(["Alpha", "Beta"]);
  });

  it("never exposes drafts or other non-open cohorts", () => {
    const result = shapeCatalogue(
      {
        courses: [course()],
        cohorts: ["draft", "full", "running", "finished"].map((status, i) => cohort({ id: 20 + i, status })),
        oneOnOne: null,
      },
      now,
    );
    expect(result.courses[0].nextCohort).toBeNull();
  });

  it("matches cohorts to their own course, by id or populated object", () => {
    const result = shapeCatalogue(
      {
        courses: [course(), course({ id: 2, slug: "two", title: "Two" })],
        cohorts: [cohort({ id: 10, course: { id: 1 } }), cohort({ id: 11, course: 2, startsAt: "2027-02-01T09:00:00.000Z" })],
        oneOnOne: null,
      },
      now,
    );
    expect(result.courses[0].nextCohort?.id).toBe("10");
    expect(result.courses[1].nextCohort?.id).toBe("11");
  });

  it("returns the exact public shape with ISO dates and string ids", () => {
    const result = shapeCatalogue(
      {
        courses: [course()],
        cohorts: [cohort({ endsAt: "2027-03-10T09:00:00Z", price: 50000, ...staffOnlyFields })],
        oneOnOne: null,
      },
      now,
    );
    expect(result.courses[0]).toEqual({
      course: {
        id: "1",
        slug: "social-media-marketing",
        title: "Social Media Marketing",
        summary: "Summary.",
        defaultPrice: 80000,
        currency: "GHS",
      },
      nextCohort: {
        id: "10",
        name: "January cohort",
        startsAt: "2027-01-10T09:00:00.000Z",
        endsAt: "2027-03-10T09:00:00.000Z",
        applicationDeadline: null,
        price: 50000,
        currency: "GHS",
        seatsLeft: 99,
      },
    });
  });

  it("leaks no staff-only fields anywhere in the output", () => {
    const json = JSON.stringify(
      shapeCatalogue(
        {
          courses: [{ ...course(), ...staffOnlyFields }],
          cohorts: [cohort(staffOnlyFields)],
          oneOnOne: { price: 1, trainers: [1], resources: [{ label: "x", url: "y" }] } as never,
        },
        now,
      ),
    );
    for (const key of ["meetingUrl", "trainers", "resources", "programKey", "seats\"", "secret"]) {
      expect(json).not.toContain(key);
    }
  });

  it("shapes one-on-one with defaults when the global is empty", () => {
    expect(shapeCatalogue({ courses: [], cohorts: [], oneOnOne: null }, now).oneOnOne).toEqual({
      price: null,
      currency: "GHS",
      durationWeeks: 2,
      daysPerWeek: 4,
      sessionCount: 8,
      included: [],
    });
  });

  it("shapes one-on-one from the global", () => {
    const { oneOnOne } = shapeCatalogue(
      {
        courses: [],
        cohorts: [],
        oneOnOne: { price: 120000, currency: "GHS", durationWeeks: 3, daysPerWeek: 2, sessionCount: 6, included: [{ item: "A certificate" }, { item: "" }] },
      },
      now,
    );
    expect(oneOnOne).toEqual({
      price: 120000,
      currency: "GHS",
      durationWeeks: 3,
      daysPerWeek: 2,
      sessionCount: 6,
      included: ["A certificate"],
    });
  });
});
