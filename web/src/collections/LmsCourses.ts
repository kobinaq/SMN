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
    defaultColumns: ["title", "delivery", "commerce", "programKey", "status", "updatedAt"],
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
      name: "delivery",
      type: "select",
      required: true,
      defaultValue: "self-paced",
      options: [
        { label: "Self-paced", value: "self-paced" },
        { label: "Cohort", value: "cohort" },
      ],
      admin: {
        description: "Self-paced lessons live in SMN. Cohort sessions use the Google Classroom invite. Assessments stay in SMN for both.",
      },
    },
    {
      name: "commerce",
      type: "select",
      required: true,
      defaultValue: "purchase",
      options: [
        { label: "Buy now (Paystack)", value: "purchase" },
        { label: "Apply first", value: "apply" },
      ],
      admin: {
        description: "Purchase courses checkout on the public catalogue. Apply-first courses use /apply, then staff grant access or send a payment link.",
      },
    },
    { name: "amount", type: "number", min: 0, admin: { description: "Checkout amount in pesewas. Required for Buy now once the fee is confirmed." } },
    { name: "currency", type: "text", defaultValue: "GHS" },
    { name: "price", type: "text", admin: { description: "Optional public price label. Blank uses the confirmed GH₵ format from amount." } },
    { name: "badge", type: "text" },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Use this published cohort as the next intake on the homepage and apply page.",
        condition: (_, siblingData) => siblingData?.delivery === "cohort",
      },
    },
    {
      name: "startDate",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.delivery === "cohort" },
    },
    {
      name: "applicationDeadline",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.delivery === "cohort" },
    },
    {
      name: "duration",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.delivery === "cohort" },
    },
    {
      name: "seats",
      type: "number",
      min: 0,
      admin: { condition: (_, siblingData) => siblingData?.delivery === "cohort" },
    },
    {
      name: "audience",
      type: "textarea",
      admin: { condition: (_, siblingData) => siblingData?.delivery === "cohort" },
    },
    {
      name: "format",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.delivery === "cohort" },
    },
    {
      name: "sessions",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.delivery === "cohort" },
    },
    {
      name: "priceConfirmed",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Only enable after the fee is confirmed. When off, the site shows Contact SMN for current fees.",
      },
    },
    {
      name: "priceLabel",
      type: "text",
      admin: {
        description: "Public fee once confirmed, e.g. GH₵2,500.",
      },
    },
    {
      name: "priceNote",
      type: "textarea",
    },
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
    {
      name: "classroomUrl",
      type: "text",
      admin: {
        description: "Google Classroom invite for this cohort. Copied onto enrollments and Classroom lessons.",
        condition: (_, siblingData) => siblingData?.delivery === "cohort",
      },
    },
    { name: "enrollmentOpen", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    { name: "certificateEnabled", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "previewEnabled", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "tutorEnabled", type: "checkbox", defaultValue: false, admin: { position: "sidebar", description: "Requires the environment Tutor feature flag and approved course material." } },
    { name: "tutorModes", type: "select", hasMany: true, defaultValue: ["explain", "simplify", "example", "summary", "revision", "socratic", "feedback", "compare", "next-lesson"], options: ["explain", "simplify", "example", "summary", "revision", "socratic", "feedback", "compare", "next-lesson"] },
    { name: "tutorGuidance", type: "textarea", maxLength: 2000, admin: { description: "Optional instructor guidance. This never overrides safety or grounding policy." } },
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
