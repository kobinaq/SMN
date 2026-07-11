import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const OpportunitySources: CollectionConfig = {
  slug: "opportunity-sources",
  admin: { useAsTitle: "name", defaultColumns: ["name", "type", "enabled", "lastSyncedAt", "lastError"], group: "Opportunities" },
  access: { admin: staffOnly, read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "type", type: "select", required: true, options: [{ label: "Greenhouse", value: "greenhouse" }, { label: "Lever", value: "lever" }, { label: "Ashby", value: "ashby" }] },
    { name: "boardToken", type: "text", required: true, admin: { description: "The public board/site identifier from the ATS careers URL." } },
    { name: "enabled", type: "checkbox", defaultValue: true },
    { name: "autoPublish", type: "checkbox", defaultValue: false, admin: { description: "Only enable after the source has proven consistently relevant." } },
    { name: "minimumScore", type: "number", defaultValue: 2, min: 1, max: 10 },
    { name: "defaultLocation", type: "text" },
    { name: "lastSyncedAt", type: "date", admin: { readOnly: true } },
    { name: "lastError", type: "textarea", admin: { readOnly: true } },
  ],
};