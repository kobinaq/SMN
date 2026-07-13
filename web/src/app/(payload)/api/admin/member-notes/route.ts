import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({ memberId: z.union([z.string().min(1), z.number()]), category: z.enum(["support", "learning", "mentorship", "opportunity", "conduct", "other"]), note: z.string().trim().min(3).max(5000) });

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: request.headers });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff access required." }, { status: 401 });
  if (!canStaff(user, "support")) return Response.json({ error: "Support permission required." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Choose a category and enter a note." }, { status: 400 });
  const member = await payload.findByID({ collection: "members", id: parsed.data.memberId, depth: 0, overrideAccess: false, user });
  const note = await payload.create({ collection: "member-notes", overrideAccess: false, user, data: { member: member.id, author: user.id, category: parsed.data.category, note: parsed.data.note } });
  return Response.json({ ok: true, id: note.id }, { status: 201 });
}
