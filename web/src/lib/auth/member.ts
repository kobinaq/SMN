import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

export type MemberUser = {
  id: string | number;
  email: string;
  name?: string | null;
  handle?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  linkedin?: string | null;
  portfolioUrl?: string | null;
  cohortStatus?: string | null;
  roles?: string[] | null;
  visibility?: string | null;
  collection: "members";
  avatar?: { url?: string | null } | string | number | null;
};

/** Current session if authenticated as a network member (not staff). */
export async function getMember(): Promise<MemberUser | null> {
  try {
    const payload = await getPayloadClient();
    const headerList = await nextHeaders();
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
