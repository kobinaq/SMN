import { describe, expect, it } from "vitest";
import { memberHasEnrollment } from "./lms-enroll";

describe("memberHasEnrollment", () => {
  it("matches an active enrollment on course id or program key", () => {
    const enrollments = [
      { status: "active", course: 4, programKey: "flagship" },
      { status: "cancelled", course: 9, programKey: "other" },
    ];
    expect(memberHasEnrollment(enrollments, { id: 4, programKey: "flagship" })).toBe(true);
    expect(memberHasEnrollment(enrollments, { id: 9, programKey: "other" })).toBe(false);
    expect(memberHasEnrollment(enrollments, { id: 99, programKey: "flagship" })).toBe(true);
  });
});
