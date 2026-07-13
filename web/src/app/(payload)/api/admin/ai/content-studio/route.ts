import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { canStaff } from "@/lib/staff-permissions";
import { lessonOutlineJSONSchema, lessonOutlineSchema, quizJSONSchema, quizSchema, rubricJSONSchema, rubricSchema } from "@/lib/ai/content-schemas";
import { recordAIEvent, runAIStructured, runAIText, validateAIInput } from "@/lib/ai/runtime";
import { AIError } from "@/lib/ai/types";

const id = z.union([z.string().min(1), z.number()]);
const controls = z.object({ audience: z.string().trim().max(200).default("SMN learners"), level: z.enum(["foundation", "intermediate", "advanced"]).default("foundation"), context: z.string().trim().max(5000).default(""), tone: z.enum(["clear", "encouraging", "professional", "conversational"]).default("clear"), length: z.enum(["short", "medium", "long"]).default("medium"), difficulty: z.enum(["easy", "balanced", "challenging"]).default("balanced"), exampleCount: z.number().int().min(0).max(10).default(2), outcome: z.string().trim().max(1000).default(""), assessmentType: z.string().trim().max(100).default(""), marks: z.number().int().min(1).max(1000).default(10), count: z.number().int().min(1).max(30).default(5) });
const generate = z.object({ action: z.literal("generate"), courseId: id, lessonId: id.optional(), kind: z.enum(["course-outline", "lesson-outline", "lesson", "example", "quiz", "rubric", "revision", "faq"]), instruction: z.string().trim().min(3).max(12000), controls });
const save = z.object({ action: z.literal("save"), courseId: id, lessonId: id.optional(), kind: generate.shape.kind, title: z.string().trim().min(1).max(200), content: z.unknown(), controls, provenance: z.object({ provider: z.string(), model: z.string(), generatedAt: z.string() }) });
const transition = z.object({ action: z.literal("transition"), draftId: id, status: z.enum(["selected", "rejected", "saved"]) });
const schema = z.discriminatedUnion("action", [generate, save, transition]);

export async function POST(request: Request) {
  if (process.env.AI_CONTENT_STUDIO_ENABLED !== "true") return Response.json({ error: "AI Content Studio is not enabled." }, { status: 503 });
  const payload = await getPayloadClient(); const { user } = await payload.auth({ headers: request.headers });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  if (!canStaff(user, "learning")) return Response.json({ error: "Learning permission required." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return Response.json({ error: "Invalid Content Studio request.", issues: parsed.error.issues }, { status: 400 });
  const api = payload as unknown as { create(args: unknown): Promise<{ id: string | number }>; update(args: unknown): Promise<unknown>; find(args: unknown): Promise<{ totalDocs: number }> };
  const event = { payload, actor: { collection: "users" as const, id: user.id }, feature: "content-studio" as const, inputChars: 0 };
  if (parsed.data.action === "transition") { await api.update({ collection: "ai-drafts", id: parsed.data.draftId, overrideAccess: false, user, data: { status: parsed.data.status } }); await recordAIEvent({ ...event, operation: `draft-${parsed.data.status}` }, "success"); return Response.json({ ok: true }); }
  if (parsed.data.action === "save") { const existing = await api.find({ collection: "ai-drafts", depth: 0, limit: 0, overrideAccess: false, user, where: { and: [{ course: { equals: parsed.data.courseId } }, { kind: { equals: parsed.data.kind } }] } }); const draft = await api.create({ collection: "ai-drafts", overrideAccess: false, user, data: { course: parsed.data.courseId, lesson: parsed.data.lessonId, kind: parsed.data.kind, title: parsed.data.title, content: parsed.data.content, status: "saved", version: existing.totalDocs + 1, createdBy: user.id, provenance: parsed.data.provenance, controls: parsed.data.controls } }); await recordAIEvent({ ...event, operation: `draft-saved:${parsed.data.kind}` }, "success"); return Response.json({ ok: true, draftId: draft.id }, { status: 201 }); }
  try {
    const instruction = validateAIInput(parsed.data.instruction); const [course, lesson] = await Promise.all([payload.findByID({ collection: "lms-courses", id: parsed.data.courseId, depth: 0, overrideAccess: false, user }), parsed.data.lessonId ? payload.findByID({ collection: "lms-lessons", id: parsed.data.lessonId, depth: 0, overrideAccess: false, user }) : null]);
    const context = `Course: ${course.title}\nSummary: ${course.summary}\nLevel: ${course.level || parsed.data.controls.level}\nOutcomes: ${(course.learningOutcomes || []).map(item => item.outcome).join("; ")}\n${lesson ? `Lesson: ${lesson.title}\nLesson summary: ${lesson.summary}\nLesson notes: ${lesson.body || ""}` : ""}`;
    const prompt = `Create a ${parsed.data.kind} draft. Instruction: ${instruction}\nControls: ${JSON.stringify(parsed.data.controls)}\nApproved course context:\n${context}\nReturn a draft for staff review. Never claim it is published.`;
    const common = { payload, actor: { collection: "users" as const, id: user.id }, feature: "content-studio" as const, operation: `generate:${parsed.data.kind}`, inputChars: instruction.length + context.length, messages: [{ role: "system" as const, content: "You are SMN Content Studio. Produce accurate, inclusive instructional drafts grounded in supplied course context. Never publish, grade learners, or invent unavailable course facts." }, { role: "user" as const, content: prompt }] };
    let result;
    if (parsed.data.kind === "quiz") result = await runAIStructured({ ...common, schema: quizSchema, jsonSchema: quizJSONSchema, schemaName: "smn_quiz", maxTokens: 2500 });
    else if (parsed.data.kind === "rubric") result = await runAIStructured({ ...common, schema: rubricSchema, jsonSchema: rubricJSONSchema, schemaName: "smn_rubric", maxTokens: 2500 });
    else if (parsed.data.kind === "lesson-outline" || parsed.data.kind === "course-outline") result = await runAIStructured({ ...common, schema: lessonOutlineSchema, jsonSchema: lessonOutlineJSONSchema, schemaName: "smn_lesson_outline", maxTokens: 2200 });
    else result = await runAIText({ ...common, maxTokens: parsed.data.controls.length === "long" ? 2500 : parsed.data.controls.length === "short" ? 700 : 1400 });
    return Response.json({ candidate: result.value, provenance: { provider: result.provider, model: result.model, generatedAt: new Date().toISOString() }, notice: "Draft only — review and save explicitly. It has not been published." });
  } catch (error) { const safe = error instanceof AIError ? error : new AIError("Generation failed.", "provider", true); return Response.json({ error: safe.message, code: safe.code }, { status: safe.code === "rate_limit" ? 429 : safe.code === "policy" ? 400 : 503 }); }
}
