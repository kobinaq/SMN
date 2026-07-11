import { headers as nextHeaders } from "next/headers";
import { z } from "zod";
import type { MemberUser } from "@/lib/auth/member";
import { getLearningDashboard } from "@/lib/learning";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({ itemId: z.union([z.string().min(1), z.number()]), status: z.enum(["not-started", "in-progress", "completed"]) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid progress update." }, { status: 400 });
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await nextHeaders() });
    if (!user || user.collection !== "members") return Response.json({ error: "Sign in to update progress." }, { status: 401 });
    const dashboard = await getLearningDashboard(user as unknown as MemberUser);
    if (!dashboard.items.some((item) => String(item.id) === String(parsed.data.itemId))) return Response.json({ error: "This item is not available to your account." }, { status: 403 });
    const existing = await payload.find({ collection: "progress", depth: 0, limit: 1, overrideAccess: true, where: { and: [{ member: { equals: user.id } }, { learningItem: { equals: parsed.data.itemId } }] } });
    const data = { status: parsed.data.status, completedAt: parsed.data.status === "completed" ? new Date().toISOString() : null };
    if (existing.docs[0]) await payload.update({ collection: "progress", id: existing.docs[0].id, overrideAccess: true, data });
    else await payload.create({ collection: "progress", overrideAccess: true, data: { member: user.id, learningItem: parsed.data.itemId, ...data } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[learning-progress]", error);
    return Response.json({ error: "Unable to save progress right now." }, { status: 500 });
  }
}