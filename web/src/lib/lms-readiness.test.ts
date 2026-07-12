import { describe, expect, it } from "vitest";
import { evaluateCourseReadiness } from "./lms-readiness";

const completeCourse = {
  title: "Campaign Strategy",
  summary: "Plan an effective campaign.",
  programKey: "campaign-strategy",
  instructor: "Arielle Adodo",
  category: "Strategy",
  learningOutcomes: [{ outcome: "Create a campaign brief" }],
};

describe("evaluateCourseReadiness", () => {
  it("accepts complete metadata and a published curriculum", () => {
    const result = evaluateCourseReadiness(completeCourse, [{ id: 1 }], [{ module: 1, status: "published" }]);
    expect(result.ready).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("reports incomplete metadata and curriculum before publication", () => {
    const result = evaluateCourseReadiness({ ...completeCourse, instructor: "", learningOutcomes: [] }, [{ id: 1 }, { id: 2 }], [{ module: 1, status: "draft" }]);
    expect(result.ready).toBe(false);
    expect(result.missing).toEqual(expect.arrayContaining(["Instructor", "At least one learning outcome", "Every module has a lesson", "All lessons published"]));
  });
});
