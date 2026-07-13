import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders() });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  if (!canStaff(user as never, "content")) return Response.json({ error: "Content permission required." }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") || "Uploaded media");
  if (!(file instanceof File)) return Response.json({ error: "Choose a file to upload." }, { status: 400 });

  try {
    const created = await payload.create({
      collection: "media",
      data: { alt },
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type || "application/octet-stream",
        name: file.name,
        size: file.size,
      },
      overrideAccess: false,
      user,
    });
    return Response.json({ ok: true, id: created.id, url: created.url }, { status: 201 });
  } catch (error) {
    console.error("[staff-media]", error);
    return Response.json({ error: "Unable to upload media." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders() });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  if (!canStaff(user as never)) return Response.json({ error: "Only super admins can update site settings." }, { status: 403 });
  // allow content role for site settings too
  if (!canStaff(user as never, "content") && !canStaff(user as never)) {
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
    return Response.json({ ok: true, id: updated.id });
  } catch (error) {
    console.error("[staff-settings]", error);
    return Response.json({ error: "Unable to save site settings." }, { status: 500 });
  }
}
