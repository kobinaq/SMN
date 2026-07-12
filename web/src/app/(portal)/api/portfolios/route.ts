import { z } from "zod";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";

const textSchema = z.object({
  title: z.string().min(3).max(140), summary: z.string().min(20).max(500),
  challenge: z.string().min(20).max(3000), approach: z.string().min(20).max(3000),
  outcome: z.string().min(20).max(3000), skills: z.array(z.string().min(1).max(60)).max(12),
  projectUrl: z.string().url().or(z.literal("")), coverUrl: z.string().url().or(z.literal("")),
  status: z.enum(["draft", "published"]), visibility: z.enum(["private", "members", "public"]),
});
function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70); }

export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") return Response.json({ error: "Sign in to manage your portfolio." }, { status: 401 });
    const form = await request.formData();
    const parsed = textSchema.safeParse({
      title: form.get("title"), summary: form.get("summary"), challenge: form.get("challenge"), approach: form.get("approach"), outcome: form.get("outcome"),
      skills: String(form.get("skills") || "").split(",").map((item) => item.trim()).filter(Boolean),
      projectUrl: form.get("projectUrl") || "", coverUrl: form.get("coverUrl") || "", status: form.get("status"), visibility: form.get("visibility"),
    });
    if (!parsed.success) return Response.json({ error: "Check the case study details and try again." }, { status: 400 });
    const file = form.get("cover"); let cover: string | number | undefined;
    if (file instanceof File && file.size) {
      if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) return Response.json({ error: "Cover must be an image no larger than 10 MB." }, { status: 400 });
      const media = await payload.create({ collection: "media", overrideAccess: true, data: { alt: `${parsed.data.title} portfolio cover` }, file: { data: Buffer.from(await file.arrayBuffer()), mimetype: file.type, name: file.name, size: file.size } });
      cover = media.id;
    }
    const base = `${slugify(user.name || user.email?.split("@")[0] || "member")}-${slugify(parsed.data.title)}`;
    const slug = `${base}-${Date.now().toString(36)}`;
    const doc = await payload.create({ collection: "portfolios", overrideAccess: true, data: { member: user.id, ...parsed.data, skills: parsed.data.skills.map((skill) => ({ skill })), projectUrl: parsed.data.projectUrl || undefined, coverUrl: parsed.data.coverUrl || undefined, slug, cover } });
    return Response.json({ ok: true, id: doc.id }, { status: 201 });
  } catch (error) { console.error("[portfolio-create]", error); return Response.json({ error: "Unable to save the case study." }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const payload = await getPayloadClient(); const { user } = await payload.auth({ headers: await memberAuthHeaders() });
  if (!user || user.collection !== "members") return Response.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id"); if (!id) return Response.json({ error: "Missing portfolio." }, { status: 400 });
  const doc = await payload.findByID({ collection: "portfolios", id, depth: 0, overrideAccess: true }); const owner = typeof doc.member === "object" ? doc.member.id : doc.member;
  if (String(owner) !== String(user.id)) return Response.json({ error: "Forbidden" }, { status: 403 });
  await payload.delete({ collection: "portfolios", id, overrideAccess: true }); return Response.json({ ok: true });
}
