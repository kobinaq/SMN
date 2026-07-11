import type { Access, CollectionConfig, PayloadRequest } from "payload";

function isStaffUser(req: PayloadRequest) {
  return Boolean(req.user && req.user.collection === "users");
}

/** Staff only (users collection). */
const isStaff: Access = ({ req }) => isStaffUser(req);

/**
 * Allow creating the very first staff user when the table is empty.
 * After that, only staff can create staff.
 */
const canCreateStaff: Access = async ({ req }) => {
  if (req.user?.collection === "users") return true;
  if (req.user) return false;
  try {
    const existing = await req.payload.find({
      collection: "users",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return existing.totalDocs === 0;
  } catch {
    // Never grant anonymous staff creation when the uniqueness check is unavailable.
    return false;
  }
};

/**
 * CMS staff only. Member accounts live in `members`.
 *
 * Important: access.admin must be FALSE when logged out.
 * Returning true for !user makes Payload render the Dashboard with
 * user=null (blank black page on Vercel) instead of redirecting to /admin/login.
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
    // admin access must return boolean only (not a Where query)
    admin: ({ req }) => isStaffUser(req),
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
