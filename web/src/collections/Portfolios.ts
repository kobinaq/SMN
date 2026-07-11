import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

export const Portfolios: CollectionConfig = {
  slug: "portfolios",
  admin: { useAsTitle: "title", defaultColumns: ["title", "member", "status", "visibility", "updatedAt"], group: "Network" },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { or: [{ member: { equals: req.user.id } }, { and: [{ status: { equals: "published" } }, { visibility: { in: ["members", "public"] } }] }] } as Where;
      return { and: [{ status: { equals: "published" } }, { visibility: { equals: "public" } }] } as Where;
    },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "summary", type: "textarea", required: true },
    { name: "challenge", type: "textarea", required: true },
    { name: "approach", type: "textarea", required: true },
    { name: "outcome", type: "textarea", required: true },
    { name: "skills", type: "array", maxRows: 12, fields: [{ name: "skill", type: "text", required: true }] },
    { name: "projectUrl", type: "text" },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "coverUrl", type: "text", admin: { description: "Optional external image URL. Used when no cover upload is set." } },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: ["draft", "published"], admin: { position: "sidebar" } },
    { name: "visibility", type: "select", required: true, defaultValue: "private", options: ["private", "members", "public"], admin: { position: "sidebar" } },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
  ],
};
