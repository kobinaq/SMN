import { APIError, type CollectionBeforeChangeHook, type CollectionConfig, type Where } from "payload";
import { evaluateCourseReadiness, type CurriculumLesson } from "@/lib/lms-readiness";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

const enforcePublicationReadiness: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  if (data.status !== "published") return data;
  const courseID = originalDoc?.id;
  const modules = courseID ? await req.payload.find({ collection: "lms-modules", depth: 0, limit: 500, overrideAccess: true, where: { course: { equals: courseID } }, req }) : { docs: [] };
  const lessons = courseID ? await req.payload.find({ collection: "lms-lessons", depth: 0, limit: 1000, overrideAccess: true, where: { course: { equals: courseID } }, req }) : { docs: [] };
  const readiness = evaluateCourseReadiness({ ...originalDoc, ...data }, modules.docs, lessons.docs as unknown as CurriculumLesson[]);
  if (!readiness.ready) throw new APIError(`Course cannot be published yet. Missing: ${readiness.missing.join(", ")}.`, 400, { missing: readiness.missing, operation }, true);
  return data;
};

export const LmsCourses: CollectionConfig = {
  slug: "lms-courses",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "programKey", "accessRule", "status", "updatedAt"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") {
        return { status: { equals: "published" } } as Where;
      }
      return false;
    },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "summary", type: "textarea", required: true },
    { name: "instructor", type: "text", admin: { description: "Instructor or facilitator shown for this course." } },
    { name: "category", type: "text", index: true },
    { name: "prerequisites", type: "textarea", admin: { description: "Use ‘None’ when the course has no prerequisites." } },
    { name: "learningOutcomes", type: "array", fields: [{ name: "outcome", type: "text", required: true }] },
    { name: "programKey", type: "text", required: true, index: true },
    {
      name: "accessRule",
      type: "select",
      required: true,
      defaultValue: "enrolled",
      options: [
        { label: "Matching enrollment", value: "enrolled" },
        { label: "Any member", value: "member" },
        { label: "Active/completed cohort member", value: "cohort" },
      ],
    },
    {
      name: "level",
      type: "select",
      defaultValue: "foundation",
      options: ["foundation", "intermediate", "advanced"],
    },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "estimatedHours", type: "number", min: 0 },
    { name: "enrollmentOpen", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    { name: "certificateEnabled", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "previewEnabled", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "order", type: "number", defaultValue: 0 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: ["draft", "published", "archived"],
      admin: { position: "sidebar" },
    },
  ],
  hooks: { beforeChange: [enforcePublicationReadiness] },
};
