import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

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
};
