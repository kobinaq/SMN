import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const Enrollments: CollectionConfig = {
  slug: "enrollments",
  admin: { useAsTitle: "programName", defaultColumns: ["member", "programName", "programType", "status", "updatedAt"], group: "Learning" },
  access: {
    admin: staffOnly,
    read: ({ req }) => req.user?.collection === "users" ? true : req.user?.collection === "members" ? { member: { equals: req.user.id } } : false,
    create: staffOnly, update: staffOnly, delete: staffOnly,
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "programName", type: "text", required: true },
    { name: "programKey", type: "text", required: true, index: true, admin: { description: "Stable key shared with learning items, e.g. cohort-2026 or ai-marketers." } },
    { name: "course", type: "relationship", relationTo: "lms-courses", maxDepth: 1, index: true },
    { name: "programType", type: "select", required: true, options: ["Cohort", "Self-paced course", "Workshop", "Community track"] },
    { name: "source", type: "select", required: true, defaultValue: "staff", options: [{ label: "Staff grant", value: "staff" }, { label: "Cohort intake", value: "cohort" }, { label: "Selar purchase", value: "selar" }] },
    { name: "externalReference", type: "text", admin: { description: "Optional Selar order/product reference." } },
    { name: "status", type: "select", required: true, defaultValue: "active", options: ["active", "completed", "paused", "cancelled"] },
    { name: "classroomUrl", type: "text" },
    { name: "courseUrl", type: "text", admin: { description: "Optional external Selar learning URL." } },
    { name: "startsAt", type: "date" },
    { name: "endsAt", type: "date" },
    { name: "startedAt", type: "date", admin: { readOnly: true } },
    { name: "lastActivityAt", type: "date", admin: { readOnly: true } },
    { name: "completedAt", type: "date", admin: { readOnly: true } },
    { name: "completionPercent", type: "number", min: 0, max: 100, defaultValue: 0, admin: { readOnly: true } },
    { name: "certificateEligible", type: "checkbox", defaultValue: false, admin: { readOnly: true } },
  ],
};
