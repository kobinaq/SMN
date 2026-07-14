import type { Where } from "payload";
import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";
import { courseOutlineJSONSchema, courseOutlineSchema } from "@/lib/ai/content-schemas";
import { isAIFeatureEnabled } from "@/lib/ai/config";
import { recordAIEvent, runAIStructured, validateAIInput } from "@/lib/ai/runtime";
import { AIError } from "@/lib/ai/types";
import { slugify } from "@/lib/staff/records";

const schema = z.object({
  action: z.literal("generate-course"),
  brief: z.string().trim().min(20).max(8000),
  level: z.enum(["foundation", "intermediate", "advanced"]).optional(),
  audience: z.string().trim().max(200).optional(),
});

async function uniqueSlug(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  collection: "lms-courses" | "lms-modules" | "lms-lessons",
  base: string,
  user: unknown,
  extraWhere?: Where,
) {
  const root = slugify(base) || "item";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
    const clauses: Where[] = [{ slug: { equals: candidate } }];
    if (extraWhere) clauses.push(extraWhere);
    const existing = await payload.find({
      collection,
      depth: 0,
      limit: 1,
      overrideAccess: false,
      user: user as never,
      where: clauses.length === 1 ? clauses[0] : { and: clauses },
    });
    if (!existing.totalDocs) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function POST(request: Request) {
  if (!isAIFeatureEnabled("content-studio")) {
    return Response.json({ error: "AI course creation is not enabled." }, { status: 503 });
  }

  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") {
    return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  }
  if (!canStaff(user, "learning")) {
    return Response.json({ error: "Learning permission required." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Describe the course in a bit more detail (at least 20 characters)." }, { status: 400 });
  }

  const brief = validateAIInput(parsed.data.brief);
  const level = parsed.data.level || "foundation";
  const audience = parsed.data.audience?.trim() || "SMN learners";

  try {
    const result = await runAIStructured({
      payload,
      actor: { collection: "users", id: user.id },
      feature: "content-studio",
      operation: "generate-course",
      inputChars: brief.length,
      schema: courseOutlineSchema,
      jsonSchema: courseOutlineJSONSchema,
      schemaName: "smn_course_outline",
      maxTokens: 4000,
      messages: [
        {
          role: "system",
          content:
            "You are the SMN Course Builder assistant. Produce a practical marketing course outline with clear modules and lessons. Keep scope realistic for a cohort programme. Never claim the course is published. Prefer reading lessons with useful starter body text.",
        },
        {
          role: "user",
          content: `Create a full course outline from this brief.\nAudience: ${audience}\nLevel: ${level}\nBrief:\n${brief}\nReturn 3-6 modules, each with 2-6 lessons. Include learning outcomes, concise summaries, and short lesson body starter notes where helpful. programKeyHint should be a short kebab-case id.`,
        },
      ],
    });

    const outline = result.value;
    const courseSlug = await uniqueSlug(payload, "lms-courses", outline.title, user);
    const programKey = slugify(outline.programKeyHint || outline.title) || courseSlug;
    const access = { overrideAccess: false, user } as const;

    let courseId: string | number | null = null;
    try {
      const course = await payload.create({
        collection: "lms-courses",
        ...access,
        data: {
          title: outline.title,
          slug: courseSlug,
          summary: outline.summary,
          programKey,
          accessRule: "enrolled",
          status: "draft",
          level: outline.level || level,
          enrollmentOpen: true,
          learningOutcomes: outline.learningOutcomes.map((outcome) => ({ outcome })),
          estimatedHours: Math.max(
            1,
            Math.round(
              outline.modules.reduce(
                (moduleTotal, module) =>
                  moduleTotal +
                  module.lessons.reduce((lessonTotal, lesson) => lessonTotal + (lesson.durationMinutes || 20), 0),
                0,
              ) / 60,
            ),
          ),
        },
      });
      courseId = course.id;

      for (const [moduleIndex, module] of outline.modules.entries()) {
        const moduleSlug = await uniqueSlug(payload, "lms-modules", module.title, user, {
          course: { equals: course.id },
        });
        const createdModule = await payload.create({
          collection: "lms-modules",
          ...access,
          data: {
            course: course.id,
            title: module.title,
            slug: moduleSlug,
            summary: module.summary || "",
            order: moduleIndex,
            status: "draft",
          },
        });

        for (const [lessonIndex, lesson] of module.lessons.entries()) {
          const lessonSlug = await uniqueSlug(payload, "lms-lessons", lesson.title, user, {
            course: { equals: course.id },
          });
          await payload.create({
            collection: "lms-lessons",
            ...access,
            data: {
              course: course.id,
              module: createdModule.id,
              title: lesson.title,
              slug: lessonSlug,
              summary: lesson.summary,
              lessonType: lesson.lessonType || "reading",
              durationMinutes: lesson.durationMinutes ?? 20,
              body: lesson.body || "",
              order: lessonIndex,
              status: "draft",
            },
          });
        }
      }

      await payload
        .create({
          collection: "ai-drafts",
          ...access,
          data: {
            course: course.id,
            kind: "course-outline",
            title: `AI course: ${outline.title}`,
            content: outline,
            status: "selected",
            version: 1,
            createdBy: user.id,
            provenance: {
              provider: result.provider,
              model: result.model,
              generatedAt: new Date().toISOString(),
            },
            controls: { audience, level, brief },
          },
        })
        .catch(() => undefined);

      await recordAIEvent(
        {
          payload,
          actor: { collection: "users", id: user.id },
          feature: "content-studio",
          operation: "generate-course",
          inputChars: brief.length,
        },
        "success",
      );

      return Response.json({
        courseId: course.id,
        title: outline.title,
        moduleCount: outline.modules.length,
        lessonCount: outline.modules.reduce((total, module) => total + module.lessons.length, 0),
        notice: "Draft course created with modules and lessons. Review curriculum, then fill instructor and settings before publishing.",
      });
    } catch (createError) {
      console.error("[generate-course] curriculum create failed", createError);
      if (courseId != null) {
        return Response.json(
          {
            courseId,
            warning: "Course draft was created, but some modules or lessons failed. Open Course Builder to finish or clean up.",
          },
          { status: 207 },
        );
      }
      throw createError;
    }
  } catch (error) {
    const safe = error instanceof AIError ? error : new AIError("Unable to generate the course draft.", "provider", true);
    await recordAIEvent(
      {
        payload,
        actor: { collection: "users", id: user.id },
        feature: "content-studio",
        operation: "generate-course",
        inputChars: brief.length,
      },
      safe.code === "timeout" ? "timeout" : safe.code === "rate_limit" ? "limited" : safe.code === "policy" ? "declined" : "error",
      safe.code,
    ).catch(() => undefined);
    return Response.json(
      { error: safe.message, code: safe.code },
      { status: safe.code === "rate_limit" ? 429 : safe.code === "policy" ? 400 : 503 },
    );
  }
}
