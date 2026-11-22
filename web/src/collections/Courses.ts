import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    useAsTitle: "title",
    group: "Courses and Cohorts",
  },
  access: {
    read: staffOnly,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "summary", type: "textarea", required: true },
    {
      name: "outcomes",
      type: "array",
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "whoItsFor",
      label: "Who it's for",
      type: "array",
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "certificateEnabled",
      label: "Awards a certificate",
      type: "checkbox",
      defaultValue: true,
    },
    { name: "duration", type: "text" },
    { name: "lessons", type: "number" },
    { name: "price", type: "text", admin: { description: "Display label (optional if amount is set)." } },
    {
      name: "amount",
      type: "number",
      min: 0,
      admin: { description: "Default cohort price in pesewas (GH₵1 = 100). A cohort can override it." },
    },
    { name: "currency", type: "text", defaultValue: "GHS" },
    {
      name: "programKey",
      type: "text",
      index: true,
      admin: { description: "Must match the LMS course program key to unlock access after Paystack." },
    },
    {
      name: "delivery",
      type: "select",
      defaultValue: "self-paced",
      options: [
        { label: "Self-paced (LMS)", value: "self-paced" },
        { label: "Live (Classroom)", value: "live" },
      ],
    },
    {
      name: "classroomUrl",
      type: "text",
      admin: { description: "Default Google Classroom link for live programs." },
    },
    {
      name: "lmsCourse",
      type: "relationship",
      relationTo: "lms-courses",
      maxDepth: 0,
      admin: { description: "The LMS course that holds this course's modules and lessons." },
    },
    {
      name: "selarUrl",
      type: "text",
      admin: { description: "Legacy Selar URL — unused for new checkouts." },
    },
    { name: "badge", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      admin: { description: "Published means visible on the public site." },
      options: [
        { label: "Published", value: "published" },
        { label: "Coming soon", value: "coming-soon" },
      ],
    },
  ],
};
