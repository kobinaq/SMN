import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const LmsLessons: CollectionConfig = {
  slug: "lms-lessons",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "module", "lessonType", "order", "status"],
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
    { name: "module", type: "relationship", relationTo: "lms-modules", required: true, maxDepth: 1 },
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, index: true },
    { name: "summary", type: "textarea", required: true },
    {
      name: "lessonType",
      type: "select",
      required: true,
      defaultValue: "video",
      options: ["video", "reading", "download", "assignment"],
    },
    {
      name: "youtubeUrl",
      type: "text",
      admin: {
        description:
          "Optional unlisted YouTube watch/share/embed URL. Videos are streamed by YouTube, not stored in R2.",
      },
    },
    { name: "durationMinutes", type: "number", min: 0 },
    {
      name: "body",
      type: "textarea",
      admin: {
        description: "Lesson text, reading content, article notes, prompts, or assignment instructions.",
      },
    },
    {
      name: "resourceLabel",
      type: "text",
      admin: { description: "Optional label for an external article or resource link." },
    },
    {
      name: "resourceUrl",
      type: "text",
      admin: { description: "Optional external article, Notion page, Google Doc, or other resource URL." },
    },
    {
      name: "attachments",
      type: "array",
      admin: { description: "Downloadable documents and files for learners." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "file", type: "upload", relationTo: "media", required: true },
      ],
    },
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
