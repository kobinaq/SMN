import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Marketing Strategy", value: "Marketing Strategy" },
        { label: "AI", value: "AI" },
        { label: "Social Media", value: "Social Media" },
        { label: "Career Development", value: "Career Development" },
        { label: "Case Studies", value: "Case Studies" },
        { label: "Industry Trends", value: "Industry Trends" },
        { label: "Community Stories", value: "Community Stories" },
      ],
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "readTime",
      type: "text",
      admin: { position: "sidebar" },
    },
  ],
};
