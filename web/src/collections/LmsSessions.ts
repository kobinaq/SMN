import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

/**
 * A scheduled live session for a cohort programme. Sessions are the backbone of
 * the in-app cohort workspace: the schedule, the "join" link, and the recording
 * all hang off this record, and attendance is taken against it.
 */
export const LmsSessions: CollectionConfig = {
  slug: "lms-sessions",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "sessionAt", "order", "status"],
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
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1, index: true },
    { name: "title", type: "text", required: true },
    { name: "summary", type: "textarea", admin: { description: "What this live session covers." } },
    { name: "sessionAt", type: "date", required: true, admin: { description: "When this live session starts." } },
    { name: "durationMinutes", type: "number", min: 0 },
    {
      name: "joinUrl",
      type: "text",
      admin: { description: "Live meeting link (Google Meet, Zoom, or Classroom) members open to join." },
    },
    {
      name: "recordingUrl",
      type: "text",
      admin: { description: "Link to the recording, added after the session runs." },
    },
    {
      name: "resources",
      type: "array",
      admin: { description: "Slides, worksheets, and files shared for this session." },
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
