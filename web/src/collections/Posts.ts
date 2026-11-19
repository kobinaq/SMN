import type { CollectionConfig, Where } from "payload";
import { postCategories, selectOptions } from "@/lib/catalogue";

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
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      const published: Where = {
        and: [
          { publishedAt: { less_than_equal: new Date().toISOString() } },
          { status: { equals: "published" } },
        ],
      };
      return published;
    },
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
      options: selectOptions(postCategories),
    },
    {
      name: "author",
      type: "text",
      admin: { description: "Article byline. Leave blank to keep the current founder byline." },
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
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "published",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
        description: "Draft hides the post. Existing posts default to published, so a deploy does not unpublish them.",
      },
    },
  ],
};
