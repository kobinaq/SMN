import { clearStaffTokenCookie } from "@/lib/auth/staff-cookies";

export async function POST() {
  await clearStaffTokenCookie();
  return Response.json({ ok: true });
}
