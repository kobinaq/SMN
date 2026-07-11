import type { CollectionConfig } from "payload";

/**
 * CMS staff only. Member accounts live in the `members` collection.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Admin",
    description: "Staff accounts for the Payload CMS admin panel.",
  },
  access: {
    // Only existing staff can manage staff users
    read: ({ req }) => Boolean(req.user && req.user.collection === "users"),
    create: ({ req }) => Boolean(req.user && req.user.collection === "users"),
    update: ({ req }) => Boolean(req.user && req.user.collection === "users"),
    delete: ({ req }) => Boolean(req.user && req.user.collection === "users"),
    admin: ({ req }) => Boolean(req.user && req.user.collection === "users"),
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
