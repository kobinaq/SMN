import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { canStaff, staffRole, type StaffRole } from "@/lib/staff-permissions";
import { ADMIN_TOKEN_COOKIE, MEMBER_TOKEN_COOKIE } from "@/lib/auth/member";

export type StaffUser = {
  id: string | number;
  email: string;
  name?: string | null;
  role?: StaffRole | null;
  collection: "users";
};

function cookieParts(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Auth headers for staff Local API calls.
 * Prefer the incoming Request in Route Handlers.
 * Promotes the staff cookie to `Authorization: JWT …` so Payload’s cookie CSRF
 * Origin allowlist cannot drop a valid session on preview/custom hosts.
 */
export async function staffAuthHeaders(request?: Request) {
  const incoming = request?.headers ?? (await nextHeaders());
  const headers = new Headers(incoming);
  const cookieHeader = headers.get("cookie") || "";
  const parts = cookieParts(cookieHeader).filter(
    (part) => !part.startsWith(`${MEMBER_TOKEN_COOKIE}=`),
  );

  const rawToken = parts
    .find((part) => part.startsWith(`${ADMIN_TOKEN_COOKIE}=`))
    ?.slice(ADMIN_TOKEN_COOKIE.length + 1);
  const token = rawToken ? decodeCookieValue(rawToken) : "";

  if (token && !headers.get("authorization")) {
    headers.set("Authorization", `JWT ${token}`);
  }

  if (parts.length) headers.set("cookie", parts.join("; "));
  else headers.delete("cookie");
  return headers;
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
