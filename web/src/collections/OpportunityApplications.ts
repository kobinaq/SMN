import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const OpportunityApplications: CollectionConfig = {
  slug: "opportunity-applications",
  admin: { useAsTitle: "id", defaultColumns: ["member", "opportunity", "status", "createdAt"], group: "Opportunities" },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { member: { equals: req.user.id } };
      return false;
    },
    create: staffOnly, update: staffOnly, delete: staffOnly,
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "opportunity", type: "relationship", relationTo: "opportunities", required: true, maxDepth: 1 },
    { name: "status", type: "select", required: true, defaultValue: "started", options: ["started", "applied", "interviewing", "offered", "declined", "withdrawn"] },
    { name: "appliedAt", type: "date" },
    { name: "memberNotes", type: "textarea" },
    { name: "staffNotes", type: "textarea", access: { read: staffOnly, create: staffOnly, update: staffOnly } },
  ],
};