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

/**
 * Seats still available in a cohort. This is the ONLY place seats-left is
 * computed. Phase 1C subtracts active enrollments here; until then it is the
 * seat total.
 */
export function seatsLeft(cohort: Pick<CohortInput, "seats">): number {
  return Math.max(0, cohort.seats ?? 0);
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
    if (cohort.status !== "open" || seatsLeft(cohort) <= 0) continue;
    const start = Date.parse(cohort.startsAt);
    if (Number.isNaN(start) || start <= now.getTime()) continue;
    if (start < bestStart) {
      best = cohort;
      bestStart = start;
    }
  }
  return best;
}
