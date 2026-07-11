import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const LearningItems: CollectionConfig = {
  slug: "learning-items",
  admin: { useAsTitle: "title", defaultColumns: ["title", "programKey", "week", "kind", "status"], group: "Learning" },
  access: {
    admin: staffOnly,
    read: ({ req }) => req.user?.collection === "users" ? true : req.user?.collection === "members" ? { status: { equals: "published" } } : false,
    create: staffOnly, update: staffOnly, delete: staffOnly,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "summary", type: "textarea", required: true },
    { name: "programKey", type: "text", required: true, index: true },
    { name: "kind", type: "select", required: true, options: ["Milestone", "Classroom session", "Resource", "Assignment", "External course", "Announcement"] },
    { name: "week", type: "number", min: 0, max: 52, defaultValue: 0, admin: { description: "Use 0 for onboarding/general items." } },
    { name: "order", type: "number", defaultValue: 0 },
    { name: "estimatedMinutes", type: "number", min: 0 },
    { name: "accessRule", type: "select", required: true, defaultValue: "enrolled", options: [{ label: "Any member", value: "member" }, { label: "Matching enrollment", value: "enrolled" }, { label: "Active/completed cohort member", value: "cohort" }] },
    { name: "externalUrl", type: "text" },
    { name: "resource", type: "relationship", relationTo: "resources", maxDepth: 2 },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: ["draft", "published", "archived"], admin: { position: "sidebar" } },
  ],
};