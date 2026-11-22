import { describe, expect, it } from "vitest";
import { effectivePrice, nextOpenCohort, seatsLeft, type CohortInput } from "./next-open-cohort";

const now = new Date("2026-12-01T00:00:00.000Z");

function cohort(overrides: Partial<CohortInput> = {}): CohortInput {
  return {
    id: 1,
    name: "January cohort",
    startsAt: "2027-01-10T09:00:00.000Z",
    seats: 20,
    status: "open",
    ...overrides,
  };
}

describe("nextOpenCohort", () => {
  it("returns null without cohorts", () => {
    expect(nextOpenCohort([], now)).toBeNull();
  });

  it("ignores draft cohorts", () => {
    expect(nextOpenCohort([cohort({ status: "draft" })], now)).toBeNull();
  });

  it("ignores open cohorts that already started", () => {
    expect(nextOpenCohort([cohort({ startsAt: "2026-11-30T09:00:00.000Z" })], now)).toBeNull();
  });

  it("ignores a cohort that starts exactly now", () => {
    expect(nextOpenCohort([cohort({ startsAt: now.toISOString() })], now)).toBeNull();
  });

  it("ignores open cohorts with no seats", () => {
    expect(nextOpenCohort([cohort({ seats: 0 })], now)).toBeNull();
    expect(nextOpenCohort([cohort({ seats: null })], now)).toBeNull();
  });

  it("skips a cohort whose seats are all taken by active enrollments", () => {
    const full = cohort({ id: 1, seats: 5, activeEnrollments: 5 });
    const later = cohort({ id: 2, startsAt: "2027-02-10T09:00:00.000Z", seats: 5, activeEnrollments: 4 });
    expect(nextOpenCohort([full, later], now)?.id).toBe(2);
    expect(nextOpenCohort([full], now)).toBeNull();
  });

  it("ignores full cohorts", () => {
    expect(nextOpenCohort([cohort({ status: "full" })], now)).toBeNull();
  });

  it("returns the earliest of several open cohorts", () => {
    const later = cohort({ id: 2, startsAt: "2027-03-01T09:00:00.000Z" });
    const earlier = cohort({ id: 3, startsAt: "2027-02-01T09:00:00.000Z" });
    const skipped = cohort({ id: 4, startsAt: "2027-01-05T09:00:00.000Z", status: "draft" });
    expect(nextOpenCohort([later, skipped, earlier], now)?.id).toBe(3);
  });
});

describe("seatsLeft", () => {
  it("is the seat total and never negative", () => {
    expect(seatsLeft({ seats: 12 })).toBe(12);
    expect(seatsLeft({ seats: -3 })).toBe(0);
    expect(seatsLeft({})).toBe(0);
  });

  it("subtracts active enrollments and clamps at 0", () => {
    expect(seatsLeft({ seats: 12 }, 5)).toBe(7);
    expect(seatsLeft({ seats: 12 }, 12)).toBe(0);
    expect(seatsLeft({ seats: 12 }, 20)).toBe(0);
  });

  it("ignores negative and NaN enrollment counts", () => {
    expect(seatsLeft({ seats: 12 }, -4)).toBe(12);
    expect(seatsLeft({ seats: 12 }, Number.NaN)).toBe(12);
    expect(seatsLeft({ seats: Number.NaN }, 2)).toBe(0);
  });
});

describe("effectivePrice", () => {
  it("prefers the cohort override over the course default", () => {
    expect(effectivePrice({ price: 50000 }, { amount: 80000 })).toEqual({ price: 50000, currency: "GHS" });
  });

  it("keeps a zero override", () => {
    expect(effectivePrice({ price: 0 }, { amount: 80000 }).price).toBe(0);
  });

  it("falls back to the course default, then null", () => {
    expect(effectivePrice({}, { amount: 80000 }).price).toBe(80000);
    expect(effectivePrice({}, {}).price).toBeNull();
  });

  it("falls back for currency: cohort, course, then GHS", () => {
    expect(effectivePrice({ currency: "USD" }, { currency: "EUR" }).currency).toBe("USD");
    expect(effectivePrice({ currency: "" }, { currency: "EUR" }).currency).toBe("EUR");
    expect(effectivePrice({}, {}).currency).toBe("GHS");
  });
});
