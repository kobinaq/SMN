import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const Progress: CollectionConfig = {
  slug: "progress",
  admin: { useAsTitle: "id", defaultColumns: ["member", "learningItem", "status", "completedAt"], group: "Learning" },
  access: {
    admin: staffOnly,
    read: ({ req }) => req.user?.collection === "users" ? true : req.user?.collection === "members" ? { member: { equals: req.user.id } } : false,
    create: staffOnly, update: staffOnly, delete: staffOnly,
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "learningItem", type: "relationship", relationTo: "learning-items", required: true, maxDepth: 1 },
    { name: "enrollment", type: "relationship", relationTo: "enrollments", maxDepth: 1 },
    { name: "status", type: "select", required: true, defaultValue: "not-started", options: ["not-started", "in-progress", "completed"] },
    { name: "completedAt", type: "date" },
  ],
};