import type { Payload } from "payload";
import {
  DEFAULT_CURRENCY,
  effectivePrice,
  nextOpenCohort,
  SEAT_HOLDING_ENROLLMENT_STATUSES,
  seatsLeft,
  type CohortInput,
  type ProgramsCatalogue,
  type PublicOneOnOne,
} from "./next-open-cohort";

export type RawCourse = {
  id: number | string;
  slug: string;
  title: string;
  summary: string;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
};

export type RawCohort = CohortInput & {
  course: number | string | { id: number | string };
};

export type RawOneOnOne = {
  price?: number | null;
  currency?: string | null;
  durationWeeks?: number | null;
  daysPerWeek?: number | null;
  sessionCount?: number | null;
  included?: Array<{ item?: string | null }> | null;
};

function courseId(course: RawCohort["course"]): string {
  return String(typeof course === "object" ? course.id : course);
}

/** Tally seat-holding (active or paused) enrollments per cohort id. Other statuses are ignored. */
export function countActiveEnrollmentsByCohort(
  enrollments: ReadonlyArray<{ cohort?: number | string | { id: number | string } | null; status?: string | null }>,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of enrollments) {
    if (!row.status || !(SEAT_HOLDING_ENROLLMENT_STATUSES as readonly string[]).includes(row.status)) continue;
    if (row.cohort == null) continue;
    const id = String(typeof row.cohort === "object" ? row.cohort.id : row.cohort);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

function iso(value: string): string {
  return new Date(value).toISOString();
}

function isoOrNull(value: string | null | undefined): string | null {
  return value ? iso(value) : null;
}

export function shapeOneOnOne(raw: RawOneOnOne | null | undefined): PublicOneOnOne {
  return {
    price: raw?.price ?? null,
    currency: raw?.currency || DEFAULT_CURRENCY,
    durationWeeks: raw?.durationWeeks ?? 2,
    daysPerWeek: raw?.daysPerWeek ?? 4,
    sessionCount: raw?.sessionCount ?? 8,
    included: (raw?.included ?? []).flatMap((row) => (row.item ? [row.item] : [])),
  };
}

/**
 * Raw documents to the public shape. Applies the visibility rules itself, so
 * a caller that over-fetches (drafts, hidden courses) still cannot leak them.
 * Output fields are picked one by one; nothing is spread from a document.
 */
export function shapeCatalogue(
  input: { courses: readonly RawCourse[]; cohorts: readonly RawCohort[]; oneOnOne: RawOneOnOne | null | undefined },
  now: Date,
): ProgramsCatalogue {
  const published = input.courses
    .filter((course) => course.status === "published")
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    courses: published.map((course) => {
      const id = String(course.id);
      const open = input.cohorts.filter(
        (cohort) => cohort.status === "open" && courseId(cohort.course) === id,
      );
      const next = nextOpenCohort(open, now);
      const defaults = effectivePrice({}, course);
      return {
        course: {
          id,
          slug: course.slug,
          title: course.title,
          summary: course.summary,
          defaultPrice: defaults.price,
          currency: defaults.currency,
        },
        nextCohort: next && {
          id: String(next.id),
          name: next.name,
          startsAt: iso(next.startsAt),
          endsAt: isoOrNull(next.endsAt),
          applicationDeadline: isoOrNull(next.applicationDeadline),
          ...effectivePrice(next, course),
          seatsLeft: seatsLeft(next, next.activeEnrollments ?? 0),
        },
      };
    }),
    oneOnOne: shapeOneOnOne(input.oneOnOne),
  };
}

export async function getProgramsCatalogue(payload?: Payload): Promise<ProgramsCatalogue> {
  const client = payload ?? (await (await import("@/lib/payload")).getPayloadClient());

  const courses = await client.find({
    collection: "courses",
    where: { status: { equals: "published" } },
    sort: "title",
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });

  const cohorts = courses.docs.length
    ? await client.find({
        collection: "cohorts",
        where: {
          and: [
            { status: { equals: "open" } },
            { course: { in: courses.docs.map((course) => course.id) } },
          ],
        },
        sort: "startsAt",
        depth: 0,
        pagination: false,
        overrideAccess: true,
      })
    : { docs: [] };

  const cohortIds = cohorts.docs.map((cohort) => cohort.id);
  const enrollments = cohortIds.length
    ? await client.find({
        collection: "enrollments",
        where: {
          and: [
            { status: { in: [...SEAT_HOLDING_ENROLLMENT_STATUSES] } },
            { cohort: { in: cohortIds } },
          ],
        },
        depth: 0,
        pagination: false,
        select: { cohort: true, status: true },
        overrideAccess: true,
      })
    : { docs: [] };
  const counts = countActiveEnrollmentsByCohort(enrollments.docs);
  const cohortsWithCounts = cohorts.docs.map((cohort) => ({
    ...cohort,
    activeEnrollments: counts.get(String(cohort.id)) ?? 0,
  }));

  const oneOnOne = await client.findGlobal({ slug: "one-on-one", depth: 0, overrideAccess: true });

  return shapeCatalogue({ courses: courses.docs, cohorts: cohortsWithCounts, oneOnOne }, new Date());
}
