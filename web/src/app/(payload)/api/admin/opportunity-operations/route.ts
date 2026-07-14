import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({
  opportunityId: z.union([z.string().min(1), z.number()]),
  status: z.enum(["published", "closed", "archived"]),
  reason: z.string().trim().min(5).max(1000),
});

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") {
    return Response.json({ error: "Staff access required." }, { status: 401 });
  }
  if (!canStaff(user as never, "opportunity", "support")) {
    return Response.json({ error: "Opportunity operations permission required." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Choose a moderation state and provide a reason." }, { status: 400 });
  }

  const access = { overrideAccess: false, user } as const;
  try {
    const current = await payload.findByID({
      collection: "opportunities",
      id: parsed.data.opportunityId,
      depth: 0,
      ...access,
    });
    const now = new Date().toISOString();
    const updated = await payload.update({
      collection: "opportunities",
      id: current.id,
      data: {
        status: parsed.data.status,
        publishedAt: parsed.data.status === "published" ? current.publishedAt || now : current.publishedAt,
      },
      ...access,
    });
    await payload.create({
      collection: "audit-events",
      data: {
        actor: user.id,
        action: `opportunity.${parsed.data.status}`,
        entityType: "opportunities",
        entityId: String(current.id),
        reason: parsed.data.reason,
        before: { status: current.status },
        after: { status: updated.status },
        visibility: "staff",
      },
      ...access,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[opportunity-operations]", error);
    return Response.json({ error: "Unable to update this opportunity." }, { status: 500 });
  }
}
