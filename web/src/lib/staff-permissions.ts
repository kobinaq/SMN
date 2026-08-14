import type { Access, PayloadRequest } from "payload";

export const staffRoles = ["super-admin", "content", "learning", "mentorship", "opportunity", "support", "analyst"] as const;
export type StaffRole = typeof staffRoles[number];

type StaffUser = { collection?: string; role?: StaffRole | null } | null | undefined;

export function staffRole(user: StaffUser): StaffRole | null {
  if (user?.collection !== "users") return null;
  return user.role || null;
}

export function canStaff(user: StaffUser, ...roles: StaffRole[]) {
  const role = staffRole(user);
  return role === "super-admin" || Boolean(role && roles.includes(role));
}

export function requireStaff(req: Pick<PayloadRequest, "user">, ...roles: StaffRole[]) {
  return canStaff(req.user as StaffUser, ...roles);
}

export const staffAccess = (...roles: StaffRole[]): Access => ({ req }) => requireStaff(req, ...roles);
export const anyStaff: Access = ({ req }) => Boolean(staffRole(req.user as StaffUser));
