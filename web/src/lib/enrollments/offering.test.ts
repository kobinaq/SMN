import { describe, expect, it } from "vitest";
import {
  cohortProgramKey,
  deriveEnrollmentDefaults,
  ONE_ON_ONE_PROGRAM_KEY,
  validateEnrollmentOffering,
} from "@/lib/enrollments/offering";

describe("keys", () => {
  it("builds stable keys", () => {
    expect(ONE_ON_ONE_PROGRAM_KEY).toBe("one-on-one");
    expect(cohortProgramKey(7)).toBe("cohort-7");
  });
});

describe("validateEnrollmentOffering", () => {
  it("accepts legacy rows", () => {
    expect(validateEnrollmentOffering({})).toBe(true);
    expect(validateEnrollmentOffering({ offering: null, cohort: null })).toBe(true);
  });
  it("requires a cohort for cohort offering", () => {
    expect(validateEnrollmentOffering({ offering: "cohort" })).toEqual(expect.any(String));
    expect(validateEnrollmentOffering({ offering: "cohort", cohort: 3 })).toBe(true);
    expect(validateEnrollmentOffering({ offering: "cohort", cohort: { id: 3 } })).toBe(true);
  });
  it("rejects a cohort on one-on-one", () => {
    expect(validateEnrollmentOffering({ offering: "one-on-one", cohort: 3 })).toEqual(expect.any(String));
    expect(validateEnrollmentOffering({ offering: "one-on-one" })).toBe(true);
  });
  it("rejects a cohort without an offering", () => {
    expect(validateEnrollmentOffering({ cohort: 3 })).toBe("Choose Cohort as the offering when a cohort is set.");
  });
  it("allows a trainer only for one-on-one", () => {
    expect(validateEnrollmentOffering({ offering: "one-on-one", trainer: 2 })).toBe(true);
    expect(validateEnrollmentOffering({ offering: "cohort", cohort: 1, trainer: 2 })).toEqual(expect.any(String));
    expect(validateEnrollmentOffering({ trainer: 2 })).toEqual(expect.any(String));
  });
});

describe("deriveEnrollmentDefaults", () => {
  const cohort = { id: 5, name: "SMM Spring", course: { id: 9 } };
  it("derives cohort fields", () => {
    expect(deriveEnrollmentDefaults({ offering: "cohort", cohort: 5 }, cohort)).toEqual({
      programKey: "cohort-5",
      programName: "SMM Spring",
      programType: "Cohort",
      catalogCourse: 9,
    });
  });
  it("never overwrites supplied values", () => {
    expect(
      deriveEnrollmentDefaults(
        { offering: "cohort", cohort: 5, programKey: "k", programName: "n", programType: "Workshop", catalogCourse: 1 },
        cohort,
      ),
    ).toEqual({});
  });
  it("derives one-on-one fields", () => {
    expect(deriveEnrollmentDefaults({ offering: "one-on-one" })).toEqual({
      programKey: "one-on-one",
      programName: "One-on-One",
      programType: "One-on-One",
    });
    expect(deriveEnrollmentDefaults({ offering: "one-on-one", programName: "Custom" })).not.toHaveProperty("programName");
  });
  it("returns an empty patch for legacy rows", () => {
    expect(deriveEnrollmentDefaults({ programKey: "x" })).toEqual({});
  });
});
