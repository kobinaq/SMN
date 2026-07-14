import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff, type StaffRole } from "@/lib/staff-permissions";
import { plainTextToLexical, slugify } from "@/lib/staff/records";

const writeRoles: Record<string, StaffRole[]> = {
  posts: ["content"],
  resources: ["content", "learning"],
  media: ["content", "learning"],
  courses: ["content"],
  events: ["content"],
  stories: ["content"],
  "lms-courses": ["learning"],
  "lms-modules": ["learning"],
  "lms-lessons": ["learning"],
  users: [], // super-admin only
  opportunities: ["opportunity"],
};

const schema = z.object({
  collection: z.string().min(1),
  action: z.enum(["create", "update", "delete"]),
  id: z.union([z.string(), z.number()]).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

function toIsoDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function coerceRelationId(value: unknown) {
  if (value === "" || value == null) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  if (value && typeof value === "object" && "id" in value) return coerceRelationId((value as { id: unknown }).id);
  return value;
}

function normalizeStaffBody(collection: string, data: Record<string, unknown>) {
  const body = { ...data };
  if (typeof body.title === "string" && !body.slug) body.slug = slugify(body.title);
  if (typeof body.contentText === "string") {
    body.content = plainTextToLexical(String(body.contentText));
    delete body.contentText;
  }
  if (typeof body.outcomesText === "string") {
    body.outcomes = String(body.outcomesText)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((item) => ({ item }));
    delete body.outcomesText;
  }
  if (typeof body.learningOutcomesText === "string") {
    body.learningOutcomes = String(body.learningOutcomesText)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((outcome) => ({ outcome }));
    delete body.learningOutcomesText;
  }
  for (const key of ["cover", "file", "image", "course", "module", "member", "mentor", "source"]) {
    if (!(key in body)) continue;
    const next = coerceRelationId(body[key]);
    if (next === undefined) delete body[key];
    else body[key] = next;
  }
  if (body.publishedAt === "" || body.publishedAt == null) {
    if ("publishedAt" in body) body.publishedAt = null;
  } else {
    const iso = toIsoDate(body.publishedAt);
    if (iso) body.publishedAt = iso;
  }
  if ("date" in body) {
    const iso = toIsoDate(body.date);
    if (iso) body.date = iso;
  }
  if (typeof body.lessons === "string") body.lessons = body.lessons === "" ? null : Number(body.lessons);
  if (typeof body.order === "string") body.order = body.order === "" ? 0 : Number(body.order);
  if (typeof body.durationMinutes === "string") {
    body.durationMinutes = body.durationMinutes === "" ? null : Number(body.durationMinutes);
  }
  if (typeof body.estimatedHours === "string") {
    body.estimatedHours = body.estimatedHours === "" ? null : Number(body.estimatedHours);
  }
  if (body.youtubeUrl === "") delete body.youtubeUrl;
  if (collection === "stories") delete body.slug;
  return body;
}

function payloadErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") return "Unable to save the record.";
  const candidate = error as {
    message?: string;
    status?: number;
    data?: { errors?: Array<{ message?: string; path?: string; label?: string }> };
  };
  const fieldErrors = candidate.data?.errors?.map((item) => item.message || item.label || item.path).filter(Boolean);
  if (fieldErrors?.length) return fieldErrors.join(" ");
  if (typeof candidate.message === "string" && candidate.message.trim()) return candidate.message;
  return "Unable to save the record.";
}

function payloadErrorStatus(error: unknown) {
  if (!error || typeof error !== "object") return 500;
  const status = (error as { status?: number; statusCode?: number }).status ?? (error as { statusCode?: number }).statusCode;
  if (status === 400 || status === 401 || status === 403 || status === 404 || status === 409) return status;
  return 500;
}

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") {
    return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid record request." }, { status: 400 });

  const { collection, action, id, data = {} } = parsed.data;
  const roles = writeRoles[collection];
  if (roles === undefined) return Response.json({ error: "Unsupported collection." }, { status: 400 });
  if (collection === "users") {
    if (!canStaff(user as never)) return Response.json({ error: "Only super admins can manage staff users." }, { status: 403 });
  } else if (!canStaff(user as never, ...roles)) {
    return Response.json({ error: "You do not have permission to change this record." }, { status: 403 });
  }

  const access = { overrideAccess: false, user } as const;

  try {
    if (action === "create") {
      const body = normalizeStaffBody(collection, data);
      const created = await payload.create({ collection: collection as never, data: body as never, ...access });
      return Response.json({ ok: true, id: (created as { id: string | number }).id }, { status: 201 });
    }

    if (!id) return Response.json({ error: "Record id is required." }, { status: 400 });

    const recordId = (typeof id === "string" && /^\d+$/.test(id) ? Number(id) : id) as string | number;

    if (action === "delete") {
      await payload.delete({ collection: collection as never, id: recordId, ...access });
      return Response.json({ ok: true });
    }

    const body = normalizeStaffBody(collection, data);
    const updated = await payload.update({
      collection: collection as never,
      id: recordId,
      data: body as never,
      ...access,
    });
    return Response.json({ ok: true, id: (updated as { id: string | number }).id });
  } catch (error) {
    console.error("[staff-records]", error);
    return Response.json({ error: payloadErrorMessage(error) }, { status: payloadErrorStatus(error) });
  }
}
