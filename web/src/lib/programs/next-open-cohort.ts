/**
 * Pure cohort rules for the public programs catalog. No Payload import.
 * Money is integer minor units (pesewas, GH₵1 = 100).
 */

export type CohortInput = {
  id: number | string;
  name: string;
  startsAt: string;
  endsAt?: string | null;
  applicationDeadline?: string | null;
  seats?: number | null;
  price?: number | null;
  currency?: string | null;
  status?: string | null;
  /** Server-side only: enrollments holding a seat. Never exposed publicly. */
  activeEnrollments?: number;
};

export type CourseInput = {
  amount?: number | null;
  currency?: string | null;
};

export type PublicCourse = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  defaultPrice: number | null;
  currency: string;
};

export type PublicCohort = {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string | null;
  applicationDeadline: string | null;
  price: number | null;
  currency: string;
  seatsLeft: number;
};

export type PublicOneOnOne = {
  price: number | null;
  currency: string;
  durationWeeks: number;
  daysPerWeek: number;
  sessionCount: number;
  included: string[];
};

export type ProgramsCatalogue = {
  courses: Array<{ course: PublicCourse; nextCohort: PublicCohort | null }>;
  oneOnOne: PublicOneOnOne;
};

export const DEFAULT_CURRENCY = "GHS";

/** Enrollment statuses that hold a seat in a cohort. */
export const SEAT_HOLDING_ENROLLMENT_STATUSES = ["active"] as const;

/**
 * Seats still available in a cohort: seats minus enrollments that hold a seat
 * (status in SEAT_HOLDING_ENROLLMENT_STATUSES), never below 0. This is the
 * ONLY place seats-left is computed.
 */
export function seatsLeft(cohort: Pick<CohortInput, "seats">, activeEnrollments = 0): number {
  const seats = Number.isFinite(cohort.seats) ? (cohort.seats as number) : 0;
  const taken = Number.isFinite(activeEnrollments) ? Math.max(0, activeEnrollments) : 0;
  return Math.max(0, seats - taken);
}

/** Cohort price override, else the course default, else null (not yet priced). */
export function effectivePrice(
  cohort: Pick<CohortInput, "price" | "currency">,
  course: CourseInput,
): { price: number | null; currency: string } {
  return {
    price: cohort.price ?? course.amount ?? null,
    currency: cohort.currency || course.currency || DEFAULT_CURRENCY,
  };
}

/** Earliest open cohort that starts after `now` and still has seats. */
export function nextOpenCohort<T extends CohortInput>(cohorts: readonly T[], now: Date): T | null {
  let best: T | null = null;
  let bestStart = Infinity;
  for (const cohort of cohorts) {
    if (cohort.status !== "open" || seatsLeft(cohort, cohort.activeEnrollments ?? 0) <= 0) continue;
    const start = Date.parse(cohort.startsAt);
    if (Number.isNaN(start) || start <= now.getTime()) continue;
    if (start < bestStart) {
      best = cohort;
      bestStart = start;
    }
  }
  return best;
}
