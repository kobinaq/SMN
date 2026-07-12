import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const LmsLessonProgress: CollectionConfig = {
  slug: "lms-lesson-progress",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["member", "course", "lesson", "status", "completedAt"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) =>
      req.user?.collection === "users"
        ? true
        : req.user?.collection === "members"
          ? { member: { equals: req.user.id } }
          : false,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1 },
    { name: "lesson", type: "relationship", relationTo: "lms-lessons", required: true, maxDepth: 1 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "not-started",
      options: ["not-started", "in-progress", "completed"],
    },
    { name: "completedAt", type: "date" },
  ],
};
