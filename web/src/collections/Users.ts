import type { Access, CollectionConfig, PayloadRequest } from "payload";
import { requireStaff, staffRoles } from "@/lib/staff-permissions";

function isStaffUser(req: PayloadRequest) {
  return Boolean(req.user && req.user.collection === "users");
}

/** Staff only (users collection). */
const isStaff: Access = ({ req }) => requireStaff(req, "analyst", "content", "learning", "mentorship", "opportunity", "support");
const isSuperAdmin: Access = ({ req }) => requireStaff(req);

/**
 * Allow creating the very first staff user when the table is empty.
 * After that, only staff can create staff.
 */
const canCreateStaff: Access = async ({ req }) => {
  if (req.user?.collection === "users") return requireStaff(req);
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
    group: "System",
    description: "Staff accounts for the Payload CMS admin panel.",
  },
  access: {
    // admin access must return boolean only (not a Where query)
    admin: ({ req }) => isStaffUser(req),
    read: isStaff,
    create: canCreateStaff,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "super-admin",
      options: staffRoles.map((role) => ({ label: role.replace("-", " ").replace(/^./, (value) => value.toUpperCase()), value: role })),
      admin: { position: "sidebar", description: "Least-privilege responsibility for this staff account." },
    },
  ],
};
