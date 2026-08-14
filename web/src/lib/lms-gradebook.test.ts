import { describe, expect, it } from "vitest";
import {
  assessmentCreateDataFromStudio,
  publicQuestion,
  remainingAttempts,
  scoreMultipleChoice,
  scoreRubric,
  submissionWindow,
} from "./lms-gradebook";

describe("submissionWindow", () => {
  const now = new Date("2026-08-14T12:00:00.000Z");

  it("stays closed before availableFrom and after due when late work is off", () => {
    expect(submissionWindow({ availableFrom: "2026-08-20T00:00:00.000Z", now })).toBe("not-open");
    expect(submissionWindow({ dueAt: "2026-08-01T00:00:00.000Z", allowLate: false, now })).toBe("closed");
    expect(submissionWindow({ dueAt: "2026-08-01T00:00:00.000Z", allowLate: true, now })).toBe("late");
  });
});

describe("scoreMultipleChoice", () => {
  const questions = [
    {
      id: "q1",
      prompt: "Pick A",
      type: "multiple-choice" as const,
      options: ["A", "B"],
      answer: "A",
      marks: 2,
    },
    {
      id: "q2",
      prompt: "Explain",
      type: "short-answer" as const,
      answer: "hidden",
      marks: 3,
    },
  ];

  it("auto-scores MCQ and flags short answers for staff", () => {
    expect(scoreMultipleChoice(questions, { q1: "A" })).toEqual({ autoScore: 2, autoMax: 2, needsManual: true });
    expect(scoreMultipleChoice(questions, { q1: "B" }).autoScore).toBe(0);
  });

  it("never includes the answer key on the public question", () => {
    expect(publicQuestion(questions[0])).toEqual({
      id: "q1",
      prompt: "Pick A",
      type: "multiple-choice",
      options: ["A", "B"],
      marks: 2,
    });
  });
});

describe("scoreRubric", () => {
  it("caps marks at the top rubric level", () => {
    const result = scoreRubric(
      [{ criterion: "Clarity", levels: [{ label: "Low", marks: 1 }, { label: "High", marks: 4 }] }],
      [{ criterion: "Clarity", marks: 9 }],
    );
    expect(result).toEqual({ score: 4, max: 4 });
  });
});

describe("remainingAttempts", () => {
  it("treats blank max as unlimited", () => {
    expect(remainingAttempts(null, 4)).toBe(Infinity);
    expect(remainingAttempts(2, 2)).toBe(0);
  });
});

describe("assessmentCreateDataFromStudio", () => {
  it("maps a quiz draft onto an assessment insert", () => {
    const data = assessmentCreateDataFromStudio({
      courseId: 3,
      kind: "quiz",
      content: {
        title: "Week 1 check",
        instructions: "Answer in order.",
        questions: [{ prompt: "Pick one", type: "multiple-choice", options: ["Yes", "No"], answer: "Yes", marks: 1 }],
      },
    });
    expect(data.kind).toBe("quiz");
    expect(data.questions?.[0]?.answer).toBe("Yes");
    expect(data.status).toBe("draft");
  });
});
