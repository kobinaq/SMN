import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const Opportunities: CollectionConfig = {
  slug: "opportunities",
  admin: { useAsTitle: "title", defaultColumns: ["title", "company", "type", "status", "sourceLabel", "updatedAt"], group: "Opportunities" },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { status: { equals: "published" } };
      return false;
    },
    create: staffOnly, update: staffOnly, delete: staffOnly,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "company", type: "text", required: true },
    { name: "summary", type: "textarea", required: true },
    { name: "description", type: "textarea" },
    { name: "type", type: "select", required: true, options: ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer"] },
    { name: "workMode", type: "select", required: true, options: ["Remote", "Hybrid", "On-site", "Unspecified"] },
    { name: "experienceLevel", type: "select", required: true, options: ["Entry level", "Mid-level", "Senior", "Lead / Head", "Any level"] },
    { name: "location", type: "text", required: true },
    { name: "salary", type: "text" },
    { name: "applicationUrl", type: "text", required: true },
    { name: "source", type: "relationship", relationTo: "opportunity-sources", maxDepth: 0 },
    { name: "externalId", type: "text", index: true },
    { name: "fingerprint", type: "text", index: true },
    { name: "sourceLabel", type: "select", required: true, defaultValue: "manual", options: [{ label: "SMN verified", value: "manual" }, { label: "Partner listing", value: "partner" }, { label: "External opportunity", value: "imported" }] },
    { name: "relevanceScore", type: "number", admin: { position: "sidebar", readOnly: true } },
    { name: "status", type: "select", required: true, defaultValue: "pending", options: ["pending", "published", "closed", "archived"], admin: { position: "sidebar" } },
    { name: "publishedAt", type: "date", admin: { position: "sidebar" } },
    { name: "expiresAt", type: "date", admin: { position: "sidebar" } },
    { name: "lastSeenAt", type: "date", admin: { position: "sidebar", readOnly: true } },
  ],
};