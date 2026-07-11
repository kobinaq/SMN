import type { Access, CollectionConfig } from "payload";

/** Staff may manage staff. Allow creating the very first user when the table is empty. */
const isStaff: Access = ({ req }) =>
  Boolean(req.user && req.user.collection === "users");

const canCreateStaff: Access = async ({ req }) => {
  if (req.user?.collection === "users") return true;
  // First-time setup: no staff users yet → allow create-first-user form
  if (!req.user) {
    try {
      const existing = await req.payload.find({
        collection: "users",
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      return existing.totalDocs === 0;
    } catch {
      return true;
    }
  }
  return false;
};

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
    // Unauthenticated: can open /admin (login / create first user).
    // Members: never. Staff: always.
    admin: ({ req }) => {
      if (!req.user) return true;
      return req.user.collection === "users";
    },
    read: isStaff,
    create: canCreateStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
