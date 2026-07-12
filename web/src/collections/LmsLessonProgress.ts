import type { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { calculateCourseCompletion } from "@/lib/lms-completion";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

const syncEnrollmentProgress: CollectionAfterChangeHook = async ({ doc, req }) => {
  const courseID = typeof doc.course === "object" ? doc.course.id : doc.course;
  const memberID = typeof doc.member === "object" ? doc.member.id : doc.member;
  if (!courseID || !memberID) return doc;
  const [course, lessons, completedProgress] = await Promise.all([
    req.payload.findByID({ collection: "lms-courses", id: courseID, depth: 0, overrideAccess: true, req }),
    req.payload.find({ collection: "lms-lessons", depth: 0, limit: 2000, overrideAccess: true, req, where: { and: [{ course: { equals: courseID } }, { status: { equals: "published" } }] } }),
    req.payload.find({ collection: "lms-lesson-progress", depth: 0, limit: 2000, overrideAccess: true, req, where: { and: [{ course: { equals: courseID } }, { member: { equals: memberID } }, { status: { equals: "completed" } }] } }),
  ]);
  const completion = calculateCourseCompletion(lessons.totalDocs, completedProgress.docs.map((item) => typeof item.lesson === "object" ? item.lesson.id : item.lesson));
  const enrollments = await req.payload.find({ collection: "enrollments", depth: 0, limit: 100, overrideAccess: true, req, where: { and: [{ member: { equals: memberID } }, { programKey: { equals: course.programKey } }] } });
  const now = new Date().toISOString();
  await Promise.all(enrollments.docs.map((enrollment) => req.payload.update({ collection: "enrollments", id: enrollment.id, overrideAccess: true, req, data: {
    course: courseID,
    startedAt: enrollment.startedAt || now,
    lastActivityAt: now,
    completedAt: completion.isComplete ? enrollment.completedAt || now : null,
    completionPercent: completion.percent,
    certificateEligible: Boolean(completion.isComplete && course.certificateEnabled),
    status: completion.isComplete ? "completed" : enrollment.status === "completed" ? "active" : enrollment.status,
  } })));
  return doc;
};

export const LmsLessonProgress: CollectionConfig = {
  slug: "lms-lesson-progress",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["member", "course", "lesson", "status", "completedAt"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) =>
      req.user?.collection === "users"
        ? true
        : req.user?.collection === "members"
          ? { member: { equals: req.user.id } }
          : false,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1 },
    { name: "lesson", type: "relationship", relationTo: "lms-lessons", required: true, maxDepth: 1 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "not-started",
      options: ["not-started", "in-progress", "completed"],
    },
    { name: "completedAt", type: "date" },
  ],
  hooks: { afterChange: [syncEnrollmentProgress] },
};
