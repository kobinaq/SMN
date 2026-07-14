import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  if (!canStaff(user as never, "content")) {
    return Response.json({ error: "Content permission required." }, { status: 403 });
  }

  const parsed = z.record(z.string(), z.unknown()).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid settings payload." }, { status: 400 });

  try {
    const updated = await payload.updateGlobal({
      slug: "site-settings",
      data: parsed.data as never,
      overrideAccess: false,
      user,
    });
    return Response.json({ ok: true, doc: updated });
  } catch (error) {
    console.error("[staff-settings]", error);
    return Response.json({ error: "Unable to save site settings." }, { status: 500 });
  }
}
