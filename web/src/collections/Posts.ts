import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "updatedAt"],
    group: "Content",
  },
  access: {
    read: ({ req }) =>
      req.user?.collection === "users"
        ? true
        : { publishedAt: { less_than_equal: new Date().toISOString() } },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
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
