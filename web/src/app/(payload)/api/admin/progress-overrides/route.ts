import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { canStaff } from "@/lib/staff-permissions";

const id = z.coerce.number().int().positive();
const schema = z.object({ courseId: id, lessonId: id, memberId: id, status: z.enum(["not-started", "in-progress", "completed"]), reason: z.string().trim().min(10).max(1000) });

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: request.headers });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff access required." }, { status: 401 });
  if (!canStaff(user, "learning", "support")) return Response.json({ error: "Learning or support permission required." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Choose a learner and lesson, then provide a reason of at least 10 characters." }, { status: 400 });
  const input = parsed.data;
  const access = { overrideAccess: false, user } as const;
  const [course, lesson, enrollment] = await Promise.all([
    payload.findByID({ collection: "lms-courses", id: input.courseId, depth: 0, ...access }),
    payload.findByID({ collection: "lms-lessons", id: input.lessonId, depth: 0, ...access }),
    payload.find({ collection: "enrollments", depth: 0, limit: 1, where: { and: [{ member: { equals: input.memberId } }, { programKey: { exists: true } }] }, ...access }),
  ]);
  const lessonCourse = typeof lesson.course === "object" ? lesson.course.id : lesson.course;
  if (String(lessonCourse) !== String(course.id) || !enrollment.docs.some((item) => item.programKey === course.programKey)) return Response.json({ error: "The learner, lesson, and course do not share a valid enrollment." }, { status: 409 });
  const existing = await payload.find({ collection: "lms-lesson-progress", depth: 0, limit: 1, where: { and: [{ member: { equals: input.memberId } }, { lesson: { equals: input.lessonId } }] }, ...access });
  const previous = existing.docs[0];
  let changedID: number | undefined;
  let created = false;
  try {
    const data = { member: input.memberId, course: input.courseId, lesson: input.lessonId, status: input.status, completedAt: input.status === "completed" ? new Date().toISOString() : null };
    const changed = previous ? await payload.update({ collection: "lms-lesson-progress", id: previous.id, data, ...access }) : await payload.create({ collection: "lms-lesson-progress", data, ...access });
    changedID = changed.id; created = !previous;
    await payload.create({ collection: "audit-events", data: { actor: user.id, action: "learning.progress.override", entityType: "lms-lesson-progress", entityId: String(changed.id), reason: input.reason, before: previous ? { status: previous.status, completedAt: previous.completedAt } : null, after: { status: changed.status, completedAt: changed.completedAt }, visibility: "staff" }, ...access });
    return Response.json({ ok: true, id: changed.id });
  } catch (error) {
    if (changedID) {
      if (created) await payload.delete({ collection: "lms-lesson-progress", id: changedID, overrideAccess: true }).catch(() => undefined);
      else if (previous) await payload.update({ collection: "lms-lesson-progress", id: previous.id, data: { status: previous.status, completedAt: previous.completedAt }, overrideAccess: true }).catch(() => undefined);
    }
    console.error("[progress-override]", error);
    return Response.json({ error: "Unable to save the audited progress override." }, { status: 500 });
  }
}
