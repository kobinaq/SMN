import { clearMemberTokenCookie } from "@/lib/auth/member-cookies";

export async function POST() {
  await clearMemberTokenCookie();
  return Response.json({ ok: true });
}
