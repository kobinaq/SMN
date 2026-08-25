import type { CollectionBeforeChangeHook, CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

const stampAuthor: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  const next = { ...data };
  if (operation === "create") {
    if (!next.author && req.user?.collection === "users") next.author = req.user.id;
    if (next.status === "published" && !next.publishedAt) next.publishedAt = new Date().toISOString();
  }
  if (next.status === "published" && !next.publishedAt) next.publishedAt = new Date().toISOString();
  return next;
};

/** Cohort announcements — the staff-to-cohort broadcast feed inside the workspace. */
export const LmsAnnouncements: CollectionConfig = {
  slug: "lms-announcements",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "pinned", "publishedAt", "status"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { status: { equals: "published" } } as Where;
      return false;
    },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1, index: true },
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    { name: "pinned", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "author", type: "relationship", relationTo: "users", maxDepth: 1, admin: { readOnly: true, position: "sidebar" } },
    { name: "publishedAt", type: "date", admin: { position: "sidebar" } },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "published",
      options: ["draft", "published"],
      admin: { position: "sidebar" },
    },
  ],
  hooks: { beforeChange: [stampAuthor] },
};
