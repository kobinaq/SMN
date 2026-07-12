import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const AuditEvents: CollectionConfig = {
  slug: "audit-events",
  admin: { useAsTitle: "action", defaultColumns: ["action", "entityType", "entityId", "actor", "createdAt"], group: "System" },
  access: { admin: staffOnly, read: staffOnly, create: staffOnly, update: () => false, delete: () => false },
  fields: [
    { name: "actor", type: "relationship", relationTo: "users", required: true, maxDepth: 1 },
    { name: "action", type: "text", required: true, index: true },
    { name: "entityType", type: "text", required: true, index: true },
    { name: "entityId", type: "text", required: true, index: true },
    { name: "reason", type: "textarea", required: true },
    { name: "before", type: "json" },
    { name: "after", type: "json" },
    { name: "visibility", type: "select", required: true, defaultValue: "staff", options: ["staff", "member-visible"] },
  ],
};
