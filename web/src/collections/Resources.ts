import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Resources: CollectionConfig = {
  slug: "resources",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "type",
      type: "select",
      required: true,
      options: ["Template", "Guide", "AI Prompts", "Checklist", "Toolkit", "Download"],
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
    },
  ],
};
