import type { MemberUser } from "@/lib/auth/member";
import {
  canAttempt,
  publicQuestion,
  remainingAttempts,
  submissionWindow,
  type QuizQuestion,
} from "@/lib/lms-gradebook";
import { getPayloadClient } from "@/lib/payload";
import { getLmsCourse } from "@/lib/lms";

function relationId(value: unknown) {
  if (value && typeof value === "object" && "id" in value) {
    return String((value as { id: string | number }).id);
  }
  return value == null ? "" : String(value);
}

export type PublicAssessment = {
  id: string | number;
  title: string;
  slug: string;
  kind: "assignment" | "quiz";
  instructions: string;
  availableFrom: string;
  dueAt: string;
  allowLate: boolean;
  maxAttempts: number | null;
  totalMarks: number;
  window: ReturnType<typeof submissionWindow>;
  remaining: number;
  questions: ReturnType<typeof publicQuestion>[];
  rubric: Array<{
    criterion: string;
    description: string;
    levels: Array<{ label: string; descriptor: string; marks: number }>;
  }>;
  latest?: {
    id: string | number;
    status: string;
    score: number | null;
    maxScore: number | null;
    feedback: string;
    submittedAt: string;
    attemptNumber: number;
  };
};

export async function getMemberCourseAssessments(
  member: MemberUser,
  courseSlug: string,
): Promise<{ courseTitle: string; courseSlug: string; href: string; assessments: PublicAssessment[] } | null> {
  const course = await getLmsCourse(member, courseSlug);
  if (!course) return null;
  const payload = await getPayloadClient();
  const [assessmentResult, submissionResult] = await Promise.all([
    payload.find({
      collection: "lms-assessments",
      depth: 0,
      limit: 100,
      sort: "order,title",
      overrideAccess: true,
      where: {
        and: [{ course: { equals: course.id } }, { status: { equals: "published" } }],
      },
    }),
    payload.find({
      collection: "lms-submissions",
      depth: 0,
      limit: 500,
      sort: "-attemptNumber",
      overrideAccess: true,
      where: {
        and: [{ member: { equals: member.id } }, { course: { equals: course.id } }],
      },
    }),
  ]);

  const byAssessment = new Map<string, (typeof submissionResult.docs)[number][]>();
  for (const row of submissionResult.docs) {
    const key = relationId(row.assessment);
    byAssessment.set(key, [...(byAssessment.get(key) ?? []), row]);
  }

  return {
    courseTitle: course.title,
    courseSlug: course.slug,
    href: course.href,
    assessments: assessmentResult.docs.map((doc) => {
      const attempts = byAssessment.get(String(doc.id)) ?? [];
      const latest = attempts[0];
      const used = attempts.filter((item) => item.status !== "in-progress").length;
      const questions = ((doc.questions || []) as QuizQuestion[]).map((question) =>
        publicQuestion({
          id: question.id,
          prompt: question.prompt,
          type: question.type === "short-answer" ? "short-answer" : "multiple-choice",
          options: question.options,
          marks: question.marks,
        }),
      );
      return {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        kind: doc.kind === "quiz" ? "quiz" : "assignment",
        instructions: doc.instructions,
        availableFrom: doc.availableFrom || "",
        dueAt: doc.dueAt || "",
        allowLate: Boolean(doc.allowLate),
        maxAttempts: typeof doc.maxAttempts === "number" ? doc.maxAttempts : null,
        totalMarks: Number(doc.totalMarks || 0),
        window: submissionWindow({
          availableFrom: doc.availableFrom,
          dueAt: doc.dueAt,
          allowLate: doc.allowLate,
        }),
        remaining: remainingAttempts(doc.maxAttempts, used),
        questions,
        rubric: (doc.rubric || []).map((item) => ({
          criterion: item.criterion,
          description: item.description || "",
          levels: (item.levels || []).map((level) => ({
            label: level.label,
            descriptor: level.descriptor || "",
            marks: Number(level.marks || 0),
          })),
        })),
        latest: latest
          ? {
              id: latest.id,
              status: String(latest.status),
              score: typeof latest.score === "number" ? latest.score : null,
              maxScore: typeof latest.maxScore === "number" ? latest.maxScore : null,
              feedback: String(latest.feedback || ""),
              submittedAt: String(latest.submittedAt || ""),
              attemptNumber: Number(latest.attemptNumber || 1),
            }
          : undefined,
      };
    }),
  };
}

export function assessmentHref(courseSlug: string, assessmentId: string | number) {
  return `/app/learning/courses/${courseSlug}/assessments/${assessmentId}`;
}

export { canAttempt };
