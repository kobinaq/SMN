import { describe, expect, it } from "vitest";
import { calculateCourseCompletion } from "./lms-completion";

describe("calculateCourseCompletion", () => {
  it("deduplicates completed lessons and calculates a bounded percentage", () => {
    expect(calculateCourseCompletion(4, [1, 1, 2])).toEqual({ completed: 2, percent: 50, isComplete: false });
  });
  it("marks only non-empty fully completed courses complete", () => {
    expect(calculateCourseCompletion(2, [1, 2])).toEqual({ completed: 2, percent: 100, isComplete: true });
    expect(calculateCourseCompletion(0, [])).toEqual({ completed: 0, percent: 0, isComplete: false });
  });
});
