/**
 * Pure enrollment offering rules. No Payload import.
 * Legacy enrollments have no offering and are never touched by these rules.
 */

export const ONE_ON_ONE_PROGRAM_KEY = "one-on-one";

export const cohortProgramKey = (cohortId: number | string): string => `cohort-${cohortId}`;

export type EnrollmentOffering = "cohort" | "one-on-one";

type Ref = number | string | { id: number | string } | null | undefined;

export type EnrollmentOfferingData = {
  offering?: string | null;
  cohort?: Ref;
  trainer?: Ref;
  programKey?: string | null;
  programName?: string | null;
  programType?: string | null;
  catalogCourse?: Ref;
};

export type CohortForDefaults = {
  id: number | string;
  name: string;
  course?: Ref;
};

export function refId(value: Ref): number | string | null {
  if (value == null || value === "") return null;
  return typeof value === "object" ? value.id : value;
}

export function validateEnrollmentOffering(data: EnrollmentOfferingData): string | true {
  const offering = data.offering || null;
  const hasCohort = refId(data.cohort) != null;
  const hasTrainer = refId(data.trainer) != null;

  if (offering === "cohort" && !hasCohort) return "Choose a cohort when the offering is Cohort.";
  if (offering === "one-on-one" && hasCohort) return "A One-on-One enrollment cannot have a cohort.";
  if (!offering && hasCohort) return "Choose Cohort as the offering when a cohort is set.";
  if (hasTrainer && offering !== "one-on-one") return "A trainer can only be set on a One-on-One enrollment.";
  return true;
}

/** Patch for blank derived fields. Never overwrites a value the caller supplied. */
export function deriveEnrollmentDefaults(
  data: EnrollmentOfferingData,
  cohort?: CohortForDefaults | null,
): Partial<Pick<EnrollmentOfferingData, "programKey" | "programName" | "programType"> & { catalogCourse: number | string }> {
  const patch: ReturnType<typeof deriveEnrollmentDefaults> = {};

  if (data.offering === "cohort") {
    const cohortId = refId(data.cohort) ?? cohort?.id ?? null;
    if (cohortId == null) return patch;
    if (!data.programKey) patch.programKey = cohortProgramKey(cohortId);
    if (!data.programName && cohort) patch.programName = cohort.name;
    if (!data.programType) patch.programType = "Cohort";
    const course = refId(cohort?.course);
    if (refId(data.catalogCourse) == null && course != null) patch.catalogCourse = course;
  } else if (data.offering === "one-on-one") {
    if (!data.programKey) patch.programKey = ONE_ON_ONE_PROGRAM_KEY;
    if (!data.programName) patch.programName = "One-on-One";
    if (!data.programType) patch.programType = "One-on-One";
  }
  return patch;
}
