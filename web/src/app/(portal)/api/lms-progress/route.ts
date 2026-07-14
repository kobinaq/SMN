import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { memberAuthHeaders, type MemberUser } from "@/lib/auth/member";
import { getLmsCourses } from "@/lib/lms";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  courseId: z.coerce.number().int().positive(),
  lessonId: z.coerce.number().int().positive(),
  status: z.enum(["not-started", "in-progress", "completed"]),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return failJson("Invalid progress update.", 400);
    }

    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return failJson("Sign in to update progress.", 401);
    }

    const courses = await getLmsCourses(user as unknown as MemberUser);
    if (!courses.some((course) => String(course.id) === String(parsed.data.courseId))) {
      return failJson("This course is not available to your account.", 403);
    }

    const existing = await payload.find({
      collection: "lms-lesson-progress",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          { member: { equals: user.id } },
          { lesson: { equals: parsed.data.lessonId } },
        ],
      },
    });
    const data = {
      status: parsed.data.status,
      completedAt: parsed.data.status === "completed" ? new Date().toISOString() : null,
    };
    if (existing.docs[0]) {
      await payload.update({
        collection: "lms-lesson-progress",
        id: existing.docs[0].id,
        overrideAccess: true,
        data,
      });
    } else {
      await payload.create({
        collection: "lms-lesson-progress",
        overrideAccess: true,
        data: {
          member: user.id,
          course: parsed.data.courseId,
          lesson: parsed.data.lessonId,
          ...data,
        },
      });
    }
    return okJson({ ok: true, status: parsed.data.status });
  } catch (error) {
    logServerError("lms-progress", error);
    return failJson("Unable to save progress right now.", 500);
  }
}
