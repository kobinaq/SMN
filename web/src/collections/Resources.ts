import type { CollectionConfig } from "payload";
import { resourceCategories, resourceFormats, selectOptions } from "@/lib/catalogue";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Resources: CollectionConfig = {
  slug: "resources",
  admin: {
    useAsTitle: "title",
    group: "Content",
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
      name: "category",
      type: "select",
      options: selectOptions(resourceCategories),
    },
    {
      name: "format",
      type: "select",
      options: selectOptions(resourceFormats),
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "externalUrl",
      type: "text",
      admin: { description: "Link for a resource that is not an uploaded file." },
    },
  ],
};
