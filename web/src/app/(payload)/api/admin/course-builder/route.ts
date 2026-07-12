import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";

const id = z.union([z.string().min(1), z.number()]);
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("reorder-modules"), courseId: id, ids: z.array(id).min(1) }),
  z.object({ action: z.literal("reorder-lessons"), courseId: id, moduleId: id, ids: z.array(id).min(1) }),
  z.object({ action: z.literal("move-lesson"), courseId: id, lessonId: id, moduleId: id, order: z.number().int().min(0) }),
  z.object({ action: z.literal("duplicate-lesson"), courseId: id, lessonId: id }),
  z.object({ action: z.literal("duplicate-module"), courseId: id, moduleId: id }),
  z.object({ action: z.literal("delete-lesson"), courseId: id, lessonId: id }),
  z.object({ action: z.literal("delete-module"), courseId: id, moduleId: id }),
]);

function relationID(value: unknown) {
  return String(value && typeof value === "object" && "id" in value ? value.id : value ?? "");
}

function copyData(doc: Record<string, unknown>, omitted: string[]) {
  return Object.fromEntries(Object.entries(doc).filter(([key]) => !omitted.includes(key)));
}

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: request.headers });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff access required." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid curriculum operation." }, { status: 400 });
  const access = { overrideAccess: false, user } as const;
  const input = parsed.data;

  try {
    if (input.action === "reorder-modules" || input.action === "reorder-lessons") {
      const collection = input.action === "reorder-modules" ? "lms-modules" : "lms-lessons";
      const docs = await payload.find({ collection, depth: 0, limit: input.ids.length, where: { id: { in: input.ids } }, ...access });
      if (docs.totalDocs !== input.ids.length || docs.docs.some((doc) => relationID(doc.course) !== String(input.courseId))) return Response.json({ error: "Curriculum records do not belong to this course." }, { status: 409 });
      if (input.action === "reorder-lessons" && docs.docs.some((doc) => relationID(doc.module) !== String(input.moduleId))) return Response.json({ error: "Lessons do not belong to this module." }, { status: 409 });
      const previous = new Map(docs.docs.map((doc) => [String(doc.id), Number(doc.order ?? 0)]));
      try {
        for (const [order, documentID] of input.ids.entries()) await payload.update({ collection, id: documentID, data: { order }, ...access });
      } catch (error) {
        await Promise.allSettled([...previous].map(([documentID, order]) => payload.update({ collection, id: documentID, data: { order }, ...access })));
        throw error;
      }
      return Response.json({ ok: true });
    }

    if (input.action === "move-lesson") {
      const [lesson, targetModule] = await Promise.all([
        payload.findByID({ collection: "lms-lessons", id: input.lessonId, depth: 0, ...access }),
        payload.findByID({ collection: "lms-modules", id: input.moduleId, depth: 0, ...access }),
      ]);
      if (relationID(lesson.course) !== String(input.courseId) || relationID(targetModule.course) !== String(input.courseId)) return Response.json({ error: "Lesson and module must belong to this course." }, { status: 409 });
      await payload.update({ collection: "lms-lessons", id: lesson.id, data: { module: targetModule.id, order: input.order }, ...access });
      return Response.json({ ok: true });
    }

    if (input.action === "delete-lesson") {
      const lesson = await payload.findByID({ collection: "lms-lessons", id: input.lessonId, depth: 0, ...access });
      if (relationID(lesson.course) !== String(input.courseId)) return Response.json({ error: "Lesson does not belong to this course." }, { status: 409 });
      await payload.delete({ collection: "lms-lessons", id: lesson.id, ...access });
      return Response.json({ ok: true });
    }

    if (input.action === "delete-module") {
      const courseModule = await payload.findByID({ collection: "lms-modules", id: input.moduleId, depth: 0, ...access });
      if (relationID(courseModule.course) !== String(input.courseId)) return Response.json({ error: "Module does not belong to this course." }, { status: 409 });
      const lessons = await payload.count({ collection: "lms-lessons", where: { module: { equals: courseModule.id } }, ...access });
      if (lessons.totalDocs) return Response.json({ error: "Move or delete this module’s lessons first." }, { status: 409 });
      await payload.delete({ collection: "lms-modules", id: courseModule.id, ...access });
      return Response.json({ ok: true });
    }

    if (input.action === "duplicate-lesson") {
      const lesson = await payload.findByID({ collection: "lms-lessons", id: input.lessonId, depth: 0, ...access });
      if (relationID(lesson.course) !== String(input.courseId)) return Response.json({ error: "Lesson does not belong to this course." }, { status: 409 });
      const data = copyData(lesson, ["id", "createdAt", "updatedAt"]);
      const duplicate = await payload.create({ collection: "lms-lessons", data: { ...data, title: `${lesson.title} (copy)`, slug: `${lesson.slug}-copy-${Date.now()}`, status: "draft", order: Number(lesson.order ?? 0) + 1 }, ...access });
      return Response.json({ ok: true, id: duplicate.id });
    }

    const courseModule = await payload.findByID({ collection: "lms-modules", id: input.moduleId, depth: 0, ...access });
    if (relationID(courseModule.course) !== String(input.courseId)) return Response.json({ error: "Module does not belong to this course." }, { status: 409 });
    const lessons = await payload.find({ collection: "lms-lessons", depth: 0, limit: 1000, sort: "order", where: { module: { equals: courseModule.id } }, ...access });
    let duplicateID: string | number | undefined;
    try {
      const moduleData = copyData(courseModule, ["id", "createdAt", "updatedAt"]);
      const duplicate = await payload.create({ collection: "lms-modules", data: { ...moduleData, title: `${courseModule.title} (copy)`, slug: `${courseModule.slug}-copy-${Date.now()}`, status: "draft", order: Number(courseModule.order ?? 0) + 1 }, ...access });
      duplicateID = duplicate.id;
      for (const lesson of lessons.docs) {
        const lessonData = copyData(lesson, ["id", "createdAt", "updatedAt"]);
        await payload.create({ collection: "lms-lessons", data: { ...lessonData, module: duplicate.id, title: `${lesson.title} (copy)`, slug: `${lesson.slug}-copy-${Date.now()}-${lesson.id}`, status: "draft" }, ...access });
      }
      return Response.json({ ok: true, id: duplicate.id });
    } catch (error) {
      if (duplicateID) await payload.delete({ collection: "lms-modules", id: duplicateID, overrideAccess: true }).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    console.error("[course-builder]", error);
    return Response.json({ error: "Unable to apply the curriculum change." }, { status: 500 });
  }
}
