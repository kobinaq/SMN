import type { CollectionConfig } from "payload";

export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
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
    { name: "price", type: "text" },
    { name: "selarUrl", type: "text", required: true },
    { name: "badge", type: "text" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
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
