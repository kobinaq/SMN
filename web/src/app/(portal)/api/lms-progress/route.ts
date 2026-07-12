import { z } from "zod";
import { memberAuthHeaders, type MemberUser } from "@/lib/auth/member";
import { getLmsCourses } from "@/lib/lms";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  courseId: z.union([z.string().min(1), z.number()]),
  lessonId: z.union([z.string().min(1), z.number()]),
  status: z.enum(["not-started", "in-progress", "completed"]),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Invalid progress update." }, { status: 400 });
    }

    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return Response.json({ error: "Sign in to update progress." }, { status: 401 });
    }

    const courses = await getLmsCourses(user as unknown as MemberUser);
    if (!courses.some((course) => String(course.id) === String(parsed.data.courseId))) {
      return Response.json({ error: "This course is not available to your account." }, { status: 403 });
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
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[lms-progress]", error);
    return Response.json({ error: "Unable to save progress right now." }, { status: 500 });
  }
}
