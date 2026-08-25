import type { CollectionBeforeChangeHook, CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

const stampAuthor: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  const next = { ...data };
  if (operation !== "create" || !req.user) return next;
  const user = req.user as { id: string | number; collection?: string; name?: string | null; email?: string | null };
  const display = (user.name?.trim() || user.email?.split("@")[0] || "SMN member").toString();
  if (user.collection === "members") {
    next.authorMember = user.id;
    next.authorStaff = null;
    next.authorName = display;
    next.authorRole = "member";
  } else if (user.collection === "users") {
    next.authorStaff = user.id;
    next.authorMember = null;
    next.authorName = user.name?.trim() || "SMN team";
    next.authorRole = "staff";
  }
  return next;
};

/**
 * A flat per-cohort discussion board. Members and staff post plain-text
 * messages; author identity is stamped server-side so it cannot be spoofed.
 */
export const LmsDiscussionPosts: CollectionConfig = {
  slug: "lms-discussion-posts",
  admin: {
    useAsTitle: "authorName",
    defaultColumns: ["authorName", "course", "authorRole", "status", "createdAt"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { status: { equals: "visible" } } as Where;
      return false;
    },
    create: ({ req }) => req.user?.collection === "users" || req.user?.collection === "members",
    // Members cannot edit or remove posts; staff moderate.
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1, index: true },
    { name: "body", type: "textarea", required: true, maxLength: 4000 },
    { name: "authorMember", type: "relationship", relationTo: "members", maxDepth: 1, admin: { readOnly: true } },
    { name: "authorStaff", type: "relationship", relationTo: "users", maxDepth: 1, admin: { readOnly: true } },
    { name: "authorName", type: "text", admin: { readOnly: true } },
    { name: "authorRole", type: "select", options: ["member", "staff"], admin: { readOnly: true } },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "visible",
      options: ["visible", "hidden"],
      admin: { position: "sidebar", description: "Hide to moderate a post out of the member board." },
    },
  ],
  hooks: { beforeChange: [stampAuthor] },
};
