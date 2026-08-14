import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { canStaff, staffRole, type StaffRole } from "@/lib/staff-permissions";
import { staffSessionHeaders, ADMIN_TOKEN_COOKIE } from "@/lib/auth/session";

export type StaffUser = {
  id: string | number;
  email: string;
  name?: string | null;
  role?: StaffRole | null;
  collection: "users";
};

export async function staffAuthHeaders(request?: Request) {
  const incoming = request?.headers ?? (await nextHeaders());
  return staffSessionHeaders(incoming);
}

export async function getStaff(): Promise<StaffUser | null> {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await staffAuthHeaders() });
    if (!user || user.collection !== "users") return null;
    return user as unknown as StaffUser;
  } catch {
    return null;
  }
}

export async function requireStaff(roles: StaffRole[] = [], callbackUrl = "/staff") {
  const staff = await getStaff();
  if (!staff) {
    redirect(`/staff/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (roles.length && !canStaff(staff, ...roles)) {
    redirect("/staff?denied=1");
  }
  return staff;
}

export function staffDisplayName(staff: StaffUser) {
  return staff.name?.trim() || staff.email.split("@")[0] || "Staff";
}

export function staffRoleLabel(staff: StaffUser) {
  return (staffRole(staff) || "staff").replace("-", " ");
}

export async function staffUserCount() {
  const payload = await getPayloadClient();
  const result = await payload.count({ collection: "users", overrideAccess: true });
  return result.totalDocs;
}

export { ADMIN_TOKEN_COOKIE };
