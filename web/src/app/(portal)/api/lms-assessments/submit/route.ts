import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { memberAuthHeaders, type MemberUser } from "@/lib/auth/member";
import {
  canAttempt,
  remainingAttempts,
  scoreMultipleChoice,
  submissionWindow,
  type QuizQuestion,
} from "@/lib/lms-gradebook";
import { getLmsCourses } from "@/lib/lms";
import { getPayloadClient } from "@/lib/payload";
import { numericId } from "@/lib/payments/checkout";

const schema = z.object({
  assessmentId: z.union([z.string(), z.number()]),
  answers: z.record(z.string(), z.unknown()).optional(),
  textResponse: z.string().max(20000).optional(),
  fileIds: z.array(z.union([z.string(), z.number()])).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return failJson("Invalid submission.", 400);

    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") return failJson("Sign in to submit work.", 401);

    const assessment = await payload.findByID({
      collection: "lms-assessments",
      id: parsed.data.assessmentId,
      depth: 0,
      overrideAccess: true,
    });
    if (assessment.status !== "published") return failJson("This assessment is not open.", 403);

    const courses = await getLmsCourses(user as unknown as MemberUser);
    const courseId =
      assessment.course && typeof assessment.course === "object" ? assessment.course.id : assessment.course;
    if (!courses.some((course) => String(course.id) === String(courseId))) {
      return failJson("This course is not available to your account.", 403);
    }

    const window = submissionWindow({
      availableFrom: assessment.availableFrom,
      dueAt: assessment.dueAt,
      allowLate: assessment.allowLate,
    });
    const prior = await payload.find({
      collection: "lms-submissions",
      depth: 0,
      limit: 100,
      overrideAccess: true,
      where: {
        and: [{ assessment: { equals: assessment.id } }, { member: { equals: user.id } }],
      },
    });
    const used = prior.docs.filter((item) => item.status !== "in-progress").length;
    const remaining = remainingAttempts(assessment.maxAttempts, used);
    if (!canAttempt({ window, remaining })) {
      return failJson(
        window === "not-open"
          ? "This assessment is not open yet."
          : window === "closed"
            ? "The due date has passed."
            : "No attempts remaining.",
        400,
      );
    }

    const questions = (assessment.questions || []) as QuizQuestion[];
    const answers = parsed.data.answers || {};
    const scored = assessment.kind === "quiz" ? scoreMultipleChoice(questions, answers) : null;
    const totalMarks = Number(assessment.totalMarks || (scored ? scored.autoMax : 0));
    const autoGraded = Boolean(scored && !scored.needsManual);
    const attemptNumber = used + 1;

    const created = await payload.create({
      collection: "lms-submissions",
      overrideAccess: true,
      data: {
        assessment: numericId(assessment.id),
        course: numericId(courseId),
        member: numericId(user.id),
        attemptNumber,
        status: autoGraded ? "graded" : "submitted",
        answers,
        textResponse: parsed.data.textResponse || undefined,
        files: (parsed.data.fileIds || [])
          .map((file, index) => {
            const id = Number(file);
            if (!Number.isFinite(id)) return null;
            return { label: `Upload ${index + 1}`, file: id };
          })
          .filter((item): item is { label: string; file: number } => Boolean(item)),
        late: window === "late",
        submittedAt: new Date().toISOString(),
        score: autoGraded ? scored?.autoScore : undefined,
        maxScore: totalMarks || scored?.autoMax,
      },
    });

    return okJson({
      ok: true,
      id: created.id,
      status: created.status,
      score: autoGraded ? scored?.autoScore : null,
      maxScore: totalMarks || scored?.autoMax || null,
    });
  } catch (error) {
    logServerError("lms-submit", error);
    return failJson("Unable to submit right now.", 500);
  }
}
