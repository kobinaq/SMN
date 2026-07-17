import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    useAsTitle: "title",
    group: "Website",
  },
  access: {
    read: ({ req }) =>
      req.user?.collection === "users"
        ? true
        : { status: { in: ["published", "coming-soon"] } },
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
    { name: "duration", type: "text" },
    { name: "lessons", type: "number" },
    { name: "price", type: "text", admin: { description: "Display label (optional if amount is set)." } },
    {
      name: "amount",
      type: "number",
      min: 0,
      admin: { description: "Checkout amount in minor units (pesewas). 0 = free catalog item." },
    },
    { name: "currency", type: "text", defaultValue: "GHS" },
    {
      name: "programKey",
      type: "text",
      index: true,
      admin: { description: "Must match LMS / learning-items key to unlock access after Paystack." },
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
      admin: { description: "Default Google Classroom link for live programmes." },
    },
    {
      name: "lmsCourse",
      type: "relationship",
      relationTo: "lms-courses",
      maxDepth: 0,
      admin: { description: "Optional link to the native LMS course." },
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
      options: [
        { label: "Published", value: "published" },
        { label: "Coming soon", value: "coming-soon" },
      ],
    },
  ],
};
