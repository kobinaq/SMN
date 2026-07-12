import { describe, expect, it } from "vitest";
import { calculateCourseAnalytics } from "./lms-analytics";

describe("calculateCourseAnalytics", () => {
  it("calculates completion, inactivity, duration, and module drop-off", () => {
    const now = new Date("2026-07-12T00:00:00Z");
    const result = calculateCourseAnalytics([
      { member: 1, status: "completed", startedAt: "2026-07-01T00:00:00Z", lastActivityAt: "2026-07-03T00:00:00Z", completedAt: "2026-07-03T00:00:00Z" },
      { member: 2, status: "active", startedAt: "2026-05-01T00:00:00Z", lastActivityAt: "2026-05-02T00:00:00Z" },
    ], [{ id: 10, title: "Foundation" }], [{ id: 20, module: 10 }, { id: 21, module: 10 }], [
      { member: 1, lesson: 20, status: "completed" }, { member: 1, lesson: 21, status: "completed" }, { member: 2, lesson: 20, status: "completed" },
    ], now);
    expect(result).toMatchObject({ enrolled: 2, started: 2, completed: 1, completionRate: 50, averageCompletionDays: 2, inactiveLearners: 1, abandonmentRate: 50 });
    expect(result.moduleStats[0]).toMatchObject({ reached: 2, completed: 1, dropOff: 1 });
  });
});
