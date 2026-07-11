import type { CollectionConfig } from "payload";

/**
 * Network members (auth-enabled). Separate from staff `users`.
 * Members use branded /login and /app — they do not access Payload admin.
 */
export const Members: CollectionConfig = {
  slug: "members",
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14, // 14 days
    verify: false, // enable with Resend email adapter later
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "cohortStatus", "updatedAt"],
    group: "Network",
    description: "Member accounts for the SMN portal (not CMS staff).",
  },
  access: {
    // Who can see this collection *inside* the admin UI (staff only).
    // Does not control /admin panel access — that is Users.access.admin.
    admin: ({ req }) => Boolean(req.user && req.user.collection === "users"),
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") {
        return { id: { equals: req.user.id } };
      }
      return false;
    },
    create: () => true, // open signup; tighten later for invite-only
    update: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") {
        return { id: { equals: req.user.id } };
      }
      return false;
    },
    delete: ({ req }) => Boolean(req.user && req.user.collection === "users"),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "handle",
      type: "text",
      unique: true,
      index: true,
      admin: {
        description: "Public profile slug, e.g. ada-okonkwo",
      },
    },
    {
      name: "headline",
      type: "text",
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "location",
      type: "text",
    },
    {
      name: "linkedin",
      type: "text",
    },
    {
      name: "portfolioUrl",
      type: "text",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "roles",
      type: "select",
      access: {
        create: ({ req }) => req.user?.collection === "users",
        update: ({ req }) => req.user?.collection === "users",
      },
      hasMany: true,
      defaultValue: ["member"],
      options: [
        { label: "Member", value: "member" },
        { label: "Mentor", value: "mentor" },
        { label: "Employer", value: "employer" },
        { label: "Alumni", value: "alumni" },
      ],
    },
    {
      name: "cohortStatus",
      type: "select",
      access: {
        create: ({ req }) => req.user?.collection === "users",
        update: ({ req }) => req.user?.collection === "users",
      },
      defaultValue: "none",
      options: [
        { label: "None", value: "none" },
        { label: "Applicant", value: "applicant" },
        { label: "Active cohort", value: "active" },
        { label: "Completed", value: "completed" },
      ],
      admin: {
        description: "Set by staff after applications / cohort intake.",
      },
    },
    {
      name: "visibility",
      type: "select",
      defaultValue: "private",
      options: [
        { label: "Private", value: "private" },
        { label: "Members only", value: "members" },
        { label: "Public", value: "public" },
      ],
    },
  ],
};
