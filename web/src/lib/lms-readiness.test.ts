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
  it("accepts complete metadata and a published hosted curriculum", () => {
    const result = evaluateCourseReadiness(
      completeCourse,
      [{ id: 1 }],
      [{ module: 1, status: "published", lessonType: "reading" }],
    );
    expect(result.ready).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("requires a Classroom invite, start date, and session for cohorts", () => {
    const result = evaluateCourseReadiness(
      { ...completeCourse, delivery: "cohort" },
      [{ id: 1 }],
      [{ module: 1, status: "published", lessonType: "reading" }],
    );
    expect(result.ready).toBe(false);
    expect(result.missing).toEqual(
      expect.arrayContaining(["Google Classroom invite", "Public start date", "At least one Classroom session"]),
    );
  });

  it("publishes a cohort with an invite, date, and classroom session", () => {
    const result = evaluateCourseReadiness(
      { ...completeCourse, delivery: "cohort", classroomUrl: "https://classroom.google.com/c/demo", startDate: "September 2026" },
      [{ id: 1 }],
      [{ module: 1, status: "published", lessonType: "classroom" }],
    );
    expect(result.ready).toBe(true);
  });

  it("requires a hosted lesson for self-paced courses", () => {
    const result = evaluateCourseReadiness(
      { ...completeCourse, delivery: "self-paced" },
      [{ id: 1 }],
      [{ module: 1, status: "published", lessonType: "classroom" }],
    );
    expect(result.ready).toBe(false);
    expect(result.missing).toContain("At least one hosted lesson");
  });

  it("reports incomplete metadata and curriculum before publication", () => {
    const result = evaluateCourseReadiness({ ...completeCourse, instructor: "", learningOutcomes: [] }, [{ id: 1 }, { id: 2 }], [{ module: 1, status: "draft" }]);
    expect(result.ready).toBe(false);
    expect(result.missing).toEqual(expect.arrayContaining(["Instructor", "At least one learning outcome", "Every module has a lesson", "All lessons published"]));
  });
});
