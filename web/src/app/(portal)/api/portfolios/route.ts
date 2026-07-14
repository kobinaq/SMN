import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";

const textSchema = z.object({
  title: z.string().min(3).max(140),
  summary: z.string().min(20).max(500),
  challenge: z.string().min(20).max(3000),
  approach: z.string().min(20).max(3000),
  outcome: z.string().min(20).max(3000),
  skills: z.array(z.string().min(1).max(60)).max(12),
  projectUrl: z.string().url().or(z.literal("")),
  coverUrl: z.string().url().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  visibility: z.enum(["private", "members", "public"]),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

async function parseCaseStudy(form: FormData) {
  return textSchema.safeParse({
    title: form.get("title"),
    summary: form.get("summary"),
    challenge: form.get("challenge"),
    approach: form.get("approach"),
    outcome: form.get("outcome"),
    skills: String(form.get("skills") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    projectUrl: form.get("projectUrl") || "",
    coverUrl: form.get("coverUrl") || "",
    status: form.get("status"),
    visibility: form.get("visibility"),
  });
}

async function maybeUploadCover(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  form: FormData,
  title: string,
) {
  const file = form.get("cover");
  if (!(file instanceof File) || !file.size) return undefined;
  if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
    throw new Error("Cover must be an image no larger than 10 MB.");
  }
  const media = await payload.create({
    collection: "media",
    overrideAccess: true,
    data: { alt: `${title} portfolio cover` },
    file: {
      data: Buffer.from(await file.arrayBuffer()),
      mimetype: file.type,
      name: file.name,
      size: file.size,
    },
  });
  return media.id as number;
}

export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return failJson("Sign in to manage your portfolio.", 401);
    }
    const form = await request.formData();
    const parsed = await parseCaseStudy(form);
    if (!parsed.success) return failJson("Check the case study details and try again.", 400);

    let cover: number | undefined;
    try {
      cover = await maybeUploadCover(payload, form, parsed.data.title);
    } catch (error) {
      return failJson(error instanceof Error ? error.message : "Invalid cover image.", 400);
    }

    const base = `${slugify(user.name || user.email?.split("@")[0] || "member")}-${slugify(parsed.data.title)}`;
    const slug = `${base}-${Date.now().toString(36)}`;
    const doc = await payload.create({
      collection: "portfolios",
      overrideAccess: true,
      data: {
        member: user.id,
        ...parsed.data,
        skills: parsed.data.skills.map((skill) => ({ skill })),
        projectUrl: parsed.data.projectUrl || undefined,
        coverUrl: parsed.data.coverUrl || undefined,
        slug,
        cover,
      },
    });
    return okJson({ ok: true, id: doc.id }, 201);
  } catch (error) {
    logServerError("portfolio-create", error);
    return failJson("Unable to save the case study.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return failJson("Sign in to manage your portfolio.", 401);
    }
    const form = await request.formData();
    const id = Number(form.get("id"));
    if (!Number.isInteger(id) || id < 1) return failJson("Missing portfolio.", 400);

    const existing = await payload.findByID({ collection: "portfolios", id, depth: 0, overrideAccess: true });
    const owner = typeof existing.member === "object" ? existing.member.id : existing.member;
    if (String(owner) !== String(user.id)) return failJson("Forbidden", 403);

    const parsed = await parseCaseStudy(form);
    if (!parsed.success) return failJson("Check the case study details and try again.", 400);

    let cover: number | undefined;
    try {
      cover = await maybeUploadCover(payload, form, parsed.data.title);
    } catch (error) {
      return failJson(error instanceof Error ? error.message : "Invalid cover image.", 400);
    }

    const doc = await payload.update({
      collection: "portfolios",
      id,
      overrideAccess: true,
      data: {
        ...parsed.data,
        skills: parsed.data.skills.map((skill) => ({ skill })),
        projectUrl: parsed.data.projectUrl || null,
        coverUrl: parsed.data.coverUrl || null,
        ...(cover ? { cover } : {}),
      },
    });
    return okJson({ ok: true, id: doc.id });
  } catch (error) {
    logServerError("portfolio-update", error);
    return failJson("Unable to update the case study.", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") return failJson("Unauthorized", 401);
    const rawId = new URL(request.url).searchParams.get("id");
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) return failJson("Missing portfolio.", 400);
    const doc = await payload.findByID({ collection: "portfolios", id, depth: 0, overrideAccess: true });
    const owner = typeof doc.member === "object" ? doc.member.id : doc.member;
    if (String(owner) !== String(user.id)) return failJson("Forbidden", 403);
    await payload.delete({ collection: "portfolios", id, overrideAccess: true });
    return okJson({ ok: true });
  } catch (error) {
    logServerError("portfolio-delete", error);
    return failJson("Unable to delete the case study.", 500);
  }
}
