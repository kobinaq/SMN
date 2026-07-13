import type { CollectionConfig } from "payload";
const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";
export const MentorshipRelationships: CollectionConfig = {
  slug: "mentorship-relationships",
  admin: { useAsTitle: "id", defaultColumns: ["mentor", "mentee", "status", "startedAt", "updatedAt"], group: "Mentorship" },
  access: { admin: staffOnly, read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: "request", type: "relationship", relationTo: "mentorship-requests", required: true, unique: true, maxDepth: 1 },
    { name: "mentor", type: "relationship", relationTo: "mentors", required: true, maxDepth: 1, index: true },
    { name: "mentee", type: "relationship", relationTo: "members", required: true, maxDepth: 1, index: true },
    { name: "status", type: "select", required: true, defaultValue: "active", options: ["proposed", "active", "completed", "cancelled"] },
    { name: "startedAt", type: "date" }, { name: "endedAt", type: "date" },
    { name: "mentorResponse", type: "textarea" },
    { name: "menteeFeedback", type: "textarea" }, { name: "mentorFeedback", type: "textarea" },
    { name: "staffNotes", type: "textarea", access: { read: staffOnly, create: staffOnly, update: staffOnly } },
  ],
};
