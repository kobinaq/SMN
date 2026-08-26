import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({
  courseId: z.coerce.number().int().positive(),
  /** Typed by the operator to confirm. Compared against the real title server-side. */
  confirmTitle: z.string().min(1),
});

/**
 * Collections that hold rows belonging to a course. Deleting the course alone
 * would strand these — orphaned lessons still satisfy `status: published`
 * queries and would keep surfacing to members.
 *
 * Ordered leaf-first so a failure part-way through never leaves a row pointing
 * at a parent that is already gone.
 */
const DEPENDENTS = [
  "lms-attendance",
  "lms-submissions",
  "lms-lesson-progress",
  "lms-discussion-posts",
  "lms-announcements",
  "lms-sessions",
  "lms-assessments",
  "lms-lessons",
  "lms-modules",
] as const;

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") {
    return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  }
  if (!canStaff(user as never, "learning")) {
    return Response.json({ error: "You do not have permission to delete courses." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid delete request." }, { status: 400 });

  const { courseId, confirmTitle } = parsed.data;

  try {
    const course = await payload.findByID({ collection: "lms-courses", id: courseId, depth: 0, overrideAccess: true });
    if (!course) return Response.json({ error: "Course not found." }, { status: 404 });

    // Re-check the typed title here, not just in the browser: the client
    // confirmation is a UX affordance, this is the actual guard.
    if (confirmTitle.trim() !== String(course.title).trim()) {
      return Response.json({ error: "The title you typed does not match this course." }, { status: 400 });
    }

    const removed: Record<string, number> = {};
    for (const collection of DEPENDENTS) {
      const result = await payload.delete({
        collection,
        where: { course: { equals: courseId } },
        overrideAccess: true,
      });
      const docs = (result as { docs?: unknown[] }).docs;
      if (Array.isArray(docs) && docs.length) removed[collection] = docs.length;
    }

    // Enrollments are member records, not course content — detach rather than
    // delete so a learner's history and any issued certificate survive.
    const enrollments = await payload.find({
      collection: "enrollments",
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      where: { course: { equals: courseId } },
    });
    for (const enrollment of enrollments.docs) {
      await payload.update({
        collection: "enrollments",
        id: enrollment.id,
        overrideAccess: true,
        data: { course: null },
      });
    }
    if (enrollments.docs.length) removed.enrollmentsDetached = enrollments.docs.length;

    await payload.delete({ collection: "lms-courses", id: courseId, overrideAccess: true });

    return Response.json({ ok: true, removed });
  } catch (error) {
    console.error("[staff-course-delete]", error);
    return Response.json({ error: "Unable to delete this course right now." }, { status: 500 });
  }
}
