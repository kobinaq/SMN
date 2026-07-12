import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const LmsModules: CollectionConfig = {
  slug: "lms-modules",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "order", "status"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { status: { equals: "published" } } as Where;
      return false;
    },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1 },
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, index: true },
    { name: "summary", type: "textarea" },
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
