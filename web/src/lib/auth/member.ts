import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { memberSessionHeaders } from "@/lib/auth/session";

export { ADMIN_COOKIE_PREFIX, ADMIN_TOKEN_COOKIE, MEMBER_TOKEN_COOKIE } from "@/lib/auth/session";

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

export async function memberAuthHeaders(request?: Request) {
  const incoming = request?.headers ?? (await nextHeaders());
  return memberSessionHeaders(incoming);
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
