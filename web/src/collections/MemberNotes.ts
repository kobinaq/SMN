import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const MemberNotes: CollectionConfig = {
  slug: "member-notes",
  admin: { useAsTitle: "category", defaultColumns: ["member", "category", "author", "createdAt"], group: "Members" },
  access: { admin: staffOnly, read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1, index: true },
    { name: "author", type: "relationship", relationTo: "users", required: true, maxDepth: 1 },
    { name: "category", type: "select", required: true, defaultValue: "support", options: ["support", "learning", "mentorship", "opportunity", "conduct", "other"] },
    { name: "note", type: "textarea", required: true, minLength: 3 },
  ],
};
