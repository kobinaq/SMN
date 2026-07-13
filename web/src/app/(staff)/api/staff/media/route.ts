import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders() });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  if (!canStaff(user as never, "content", "learning")) {
    return Response.json({ error: "Content or learning permission required." }, { status: 403 });
  }

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
