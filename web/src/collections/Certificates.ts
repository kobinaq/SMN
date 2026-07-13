import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const Certificates: CollectionConfig = {
  slug: "certificates",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "member", "programName", "status", "issuedAt"],
    group: "Credentials",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") {
        return {
          or: [
            { member: { equals: req.user.id } },
            { and: [{ status: { equals: "valid" } }, { visibility: { equals: "public" } }] },
          ],
        } as Where;
      }
      return { and: [{ status: { equals: "valid" } }, { visibility: { equals: "public" } }] } as Where;
    },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "title", type: "text", required: true },
    { name: "programName", type: "text", required: true },
    { name: "programKey", type: "text", index: true },
    { name: "course", type: "relationship", relationTo: "lms-courses", maxDepth: 1, index: true },
    { name: "enrollment", type: "relationship", relationTo: "enrollments", maxDepth: 1, index: true },
    { name: "issuedBy", type: "relationship", relationTo: "users", required: true, maxDepth: 1, index: true },
    { name: "activeIssuanceKey", type: "text", unique: true, index: true, admin: { hidden: true } },
    { name: "credentialCode", type: "text", required: true, unique: true, index: true },
    { name: "summary", type: "textarea" },
    { name: "skills", type: "array", maxRows: 16, fields: [{ name: "skill", type: "text", required: true }] },
    { name: "pdf", type: "upload", relationTo: "media", admin: { description: "Upload the issued PDF certificate." } },
    { name: "issuedAt", type: "date", required: true },
    { name: "expiresAt", type: "date" },
    { name: "reissuedFrom", type: "relationship", relationTo: "certificates", maxDepth: 1, index: true },
    { name: "revokedAt", type: "date", admin: { readOnly: true } },
    { name: "revokedBy", type: "relationship", relationTo: "users", maxDepth: 1, admin: { readOnly: true } },
    { name: "revocationReason", type: "textarea", admin: { readOnly: true } },
    { name: "notificationStatus", type: "select", defaultValue: "pending", options: ["pending", "sent", "skipped", "failed"], admin: { readOnly: true } },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "valid",
      options: ["draft", "valid", "revoked"],
      admin: { position: "sidebar" },
    },
    {
      name: "visibility",
      type: "select",
      required: true,
      defaultValue: "public",
      options: ["private", "public"],
      admin: { position: "sidebar" },
    },
  ],
};
