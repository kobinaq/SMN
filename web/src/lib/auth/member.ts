import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

export const ADMIN_COOKIE_PREFIX = "smn-admin";
export const ADMIN_TOKEN_COOKIE = `${ADMIN_COOKIE_PREFIX}-token`;
export const MEMBER_TOKEN_COOKIE = "smn-member-token";

export type MemberUser = {
  id: string | number;
  email: string;
  name?: string | null;
  handle?: string | null;
  headline?: string | null;
  bio?: string | null;
  skills?: Array<{ skill?: string | null }> | null;
  careerGoals?: string | null;
  careerInterests?: Array<{ interest?: string | null }> | null;
  location?: string | null;
  linkedin?: string | null;
  portfolioUrl?: string | null;
  cohortStatus?: string | null;
  roles?: string[] | null;
  visibility?: string | null;
  collection: "members";
  avatar?: { url?: string | null } | string | number | null;
};

function cookieParts(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function memberAuthHeaders() {
  const incoming = await nextHeaders();
  const headers = new Headers(incoming);
  const cookieHeader = headers.get("cookie") || "";
  const parts = cookieParts(cookieHeader);
  const memberToken = parts
    .find((part) => part.startsWith(`${MEMBER_TOKEN_COOKIE}=`))
    ?.slice(MEMBER_TOKEN_COOKIE.length + 1);
  const filtered = parts.filter(
    (part) =>
      !part.startsWith(`${ADMIN_TOKEN_COOKIE}=`) &&
      !part.startsWith(`${MEMBER_TOKEN_COOKIE}=`),
  );

  if (memberToken) {
    filtered.push(`${ADMIN_TOKEN_COOKIE}=${memberToken}`);
  }

  if (filtered.length) headers.set("cookie", filtered.join("; "));
  else headers.delete("cookie");

  return headers;
}

/** Current session if authenticated as a network member (not staff). */
export async function getMember(): Promise<MemberUser | null> {
  try {
    const payload = await getPayloadClient();
    const headerList = await memberAuthHeaders();
    const { user } = await payload.auth({ headers: headerList });

    if (!user || user.collection !== "members") {
      return null;
    }

    return user as unknown as MemberUser;
  } catch {
    return null;
  }
}

/** Require member session or redirect to login. */
export async function requireMember(callbackUrl = "/app") {
  const member = await getMember();
  if (!member) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return member;
}

export function memberDisplayName(member: MemberUser) {
  return member.name?.trim() || member.email.split("@")[0] || "Member";
}
