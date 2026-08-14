import { z } from "zod";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { rubricMaxMarks, scoreRubric } from "@/lib/lms-gradebook";
import { getPayloadClient } from "@/lib/payload";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({
  submissionId: z.union([z.string(), z.number()]),
  score: z.number().min(0).optional(),
  feedback: z.string().max(8000).optional(),
  status: z.enum(["graded", "returned"]).default("graded"),
  rubricScores: z
    .array(
      z.object({
        criterion: z.string(),
        marks: z.number().min(0),
        comment: z.string().optional(),
      }),
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
    if (!user || user.collection !== "users") {
      return Response.json({ error: "Staff sign-in required." }, { status: 401 });
    }
    if (!canStaff(user as never, "learning", "support")) {
      return Response.json({ error: "Learning permission required." }, { status: 403 });
    }

    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: "Invalid grade payload." }, { status: 400 });

    const submission = await payload.findByID({
      collection: "lms-submissions",
      id: parsed.data.submissionId,
      depth: 1,
      overrideAccess: true,
    });
    const assessment =
      submission.assessment && typeof submission.assessment === "object" ? submission.assessment : null;
    if (!assessment) return Response.json({ error: "Assessment missing on this submission." }, { status: 400 });

    const rubric = (assessment.rubric || []).map((item) => ({
      criterion: item.criterion,
      description: item.description,
      levels: (item.levels || []).map((level) => ({
        label: level.label,
        descriptor: level.descriptor,
        marks: Number(level.marks || 0),
      })),
    }));
    const rubricResult = parsed.data.rubricScores?.length
      ? scoreRubric(rubric, parsed.data.rubricScores)
      : null;
    const maxScore = Number(submission.maxScore || assessment.totalMarks || rubricMaxMarks(rubric) || 0);
    const score = rubricResult ? rubricResult.score : parsed.data.score;
    if (score == null) return Response.json({ error: "Enter a score or complete the rubric." }, { status: 400 });

    await payload.update({
      collection: "lms-submissions",
      id: submission.id,
      overrideAccess: true,
      data: {
        status: parsed.data.status,
        score,
        maxScore: rubricResult?.max || maxScore,
        feedback: parsed.data.feedback || "",
        rubricScores: parsed.data.rubricScores,
        gradedBy: user.id,
        gradedAt: new Date().toISOString(),
      },
    });

    return Response.json({ ok: true, score });
  } catch (error) {
    console.error("[staff-grade]", error);
    return Response.json({ error: "Unable to save grade." }, { status: 500 });
  }
}
