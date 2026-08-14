export type QuizQuestionType = "multiple-choice" | "short-answer";

export type QuizQuestion = {
  id?: string | null;
  prompt: string;
  type: QuizQuestionType;
  options?: string[] | Array<{ option?: string | null }> | null;
  answer?: string | null;
  marks: number;
};

export type RubricLevel = { label: string; descriptor?: string | null; marks: number };
export type RubricCriterion = {
  criterion: string;
  description?: string | null;
  levels?: RubricLevel[] | null;
};

export type AssessmentKind = "assignment" | "quiz";

export type SubmissionWindow = "not-open" | "open" | "late" | "closed";

function present(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAnswer(value: unknown) {
  return present(value).toLowerCase();
}

export function questionOptions(question: QuizQuestion): string[] {
  if (!question.options) return [];
  return question.options
    .map((item) => (typeof item === "string" ? item : present(item?.option)))
    .filter(Boolean);
}

export function questionMarks(question: QuizQuestion) {
  return Number.isFinite(question.marks) && question.marks > 0 ? question.marks : 0;
}

export function quizTotalMarks(questions: QuizQuestion[]) {
  return questions.reduce((total, question) => total + questionMarks(question), 0);
}

export function submissionWindow(args: {
  availableFrom?: string | null;
  dueAt?: string | null;
  allowLate?: boolean | null;
  now?: Date;
}): SubmissionWindow {
  const now = args.now ?? new Date();
  if (args.availableFrom) {
    const start = new Date(args.availableFrom);
    if (!Number.isNaN(start.getTime()) && now < start) return "not-open";
  }
  if (args.dueAt) {
    const due = new Date(args.dueAt);
    if (!Number.isNaN(due.getTime()) && now > due) return args.allowLate ? "late" : "closed";
  }
  return "open";
}

export function remainingAttempts(maxAttempts: number | null | undefined, used: number) {
  if (!maxAttempts || maxAttempts < 1) return Infinity;
  return Math.max(0, maxAttempts - used);
}

export function scoreMultipleChoice(questions: QuizQuestion[], answers: Record<string, unknown>) {
  let autoScore = 0;
  let autoMax = 0;
  let needsManual = false;
  for (const question of questions) {
    const marks = questionMarks(question);
    if (question.type === "multiple-choice") {
      autoMax += marks;
      const key = question.id ? String(question.id) : question.prompt;
      if (normalizeAnswer(answers[key]) === normalizeAnswer(question.answer)) autoScore += marks;
    } else {
      needsManual = true;
    }
  }
  return { autoScore, autoMax, needsManual };
}

export function rubricMaxMarks(criteria: RubricCriterion[]) {
  return criteria.reduce((total, item) => {
    const top = (item.levels || []).reduce((max, level) => Math.max(max, Number(level.marks) || 0), 0);
    return total + top;
  }, 0);
}

export function scoreRubric(
  criteria: RubricCriterion[],
  scores: Array<{ criterion?: string | null; marks?: number | null }>,
) {
  const byName = new Map(scores.map((item) => [present(item.criterion), Number(item.marks) || 0]));
  let score = 0;
  for (const item of criteria) {
    const cap = (item.levels || []).reduce((max, level) => Math.max(max, Number(level.marks) || 0), 0);
    const raw = byName.get(item.criterion) ?? 0;
    score += Math.min(Math.max(raw, 0), cap);
  }
  return { score, max: rubricMaxMarks(criteria) };
}

export function publicQuestion(question: QuizQuestion) {
  return {
    id: question.id || "",
    prompt: question.prompt,
    type: question.type,
    options: questionOptions(question),
    marks: questionMarks(question),
  };
}

export function canAttempt(args: { window: SubmissionWindow; remaining: number }) {
  if (args.window === "not-open" || args.window === "closed") return false;
  return args.remaining > 0;
}

type StudioQuestion = {
  prompt?: unknown;
  type?: unknown;
  options?: unknown;
  answer?: unknown;
  marks?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function assessmentCreateDataFromStudio(args: {
  courseId: string | number;
  kind: "quiz" | "rubric";
  content: unknown;
  lessonId?: string | number;
}) {
  const content = args.content && typeof args.content === "object" && !Array.isArray(args.content)
    ? (args.content as Record<string, unknown>)
    : {};
  const title = asString(content.title) || (args.kind === "quiz" ? "Quiz draft" : "Assignment draft");
  if (args.kind === "quiz") {
    const questions: QuizQuestion[] = (Array.isArray(content.questions) ? content.questions : [])
      .map((item) => {
        const question = (item || {}) as StudioQuestion;
        const type: QuizQuestionType =
          question.type === "short-answer" || question.type === "scenario" ? "short-answer" : "multiple-choice";
        const options = Array.isArray(question.options)
          ? question.options.map((option) => ({ option: asString(option) })).filter((row) => row.option)
          : [];
        return {
          prompt: asString(question.prompt),
          type,
          options,
          answer: asString(question.answer),
          marks: Number(question.marks) > 0 ? Number(question.marks) : 1,
        };
      })
      .filter((question) => question.prompt);
    return {
      course: args.courseId,
      lesson: args.lessonId || undefined,
      title,
      slug: `${(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "quiz").slice(0, 48)}-${Date.now().toString(36)}`,
      kind: "quiz" as const,
      instructions: asString(content.instructions) || "Complete the quiz.",
      questions,
      totalMarks: Number(content.totalMarks) || quizTotalMarks(questions),
      status: "draft" as const,
    };
  }

  const rubric = (Array.isArray(content.criteria) ? content.criteria : []).map((item) => {
    const row = (item || {}) as {
      criterion?: unknown;
      description?: unknown;
      levels?: Array<{ label?: unknown; descriptor?: unknown; marks?: unknown }>;
    };
    return {
      criterion: asString(row.criterion),
      description: asString(row.description),
      levels: (row.levels || []).map((level) => ({
        label: asString(level.label),
        descriptor: asString(level.descriptor),
        marks: Number(level.marks) || 0,
      })),
    };
  }).filter((item) => item.criterion);

  return {
    course: args.courseId,
    lesson: args.lessonId || undefined,
    title,
    slug: `${(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "assignment").slice(0, 48)}-${Date.now().toString(36)}`,
    kind: "assignment" as const,
    instructions: asString(content.instructions) || "Submit the assignment.",
    rubric,
    totalMarks: Number(content.totalMarks) || rubricMaxMarks(rubric),
    status: "draft" as const,
  };
}
