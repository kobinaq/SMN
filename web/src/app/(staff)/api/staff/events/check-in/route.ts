import { z } from "zod";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({
  ticketCode: z.string().min(4),
  eventId: z.union([z.string(), z.number()]).optional(),
});

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users" || !canStaff(user as never, "content", "support")) {
    return Response.json({ error: "Staff access required." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Ticket code required." }, { status: 400 });
  }

  const p = payload as unknown as {
    find(args: Record<string, unknown>): Promise<{ docs: Array<Record<string, unknown>> }>;
    update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  };

  const where: Record<string, unknown> = {
    and: [{ ticketCode: { equals: parsed.data.ticketCode.trim().toUpperCase() } }],
  };
  if (parsed.data.eventId) {
    (where.and as unknown[]).push({ event: { equals: parsed.data.eventId } });
  }

  const found = await p.find({
    collection: "event-registrations",
    limit: 1,
    depth: 1,
    where,
    overrideAccess: true,
  });
  const reg = found.docs[0];
  if (!reg) return Response.json({ error: "Ticket not found." }, { status: 404 });
  if (reg.status === "cancelled") return Response.json({ error: "Ticket cancelled." }, { status: 400 });
  if (reg.status === "checked_in") {
    return Response.json({ ok: true, already: true, registration: reg });
  }
  if (reg.status !== "confirmed" && reg.status !== "pending_payment") {
    return Response.json({ error: `Cannot check in status ${reg.status}.` }, { status: 400 });
  }

  const updated = await p.update({
    collection: "event-registrations",
    id: reg.id,
    data: {
      status: "checked_in",
      checkedInAt: new Date().toISOString(),
      checkedInBy: user.id,
    },
    overrideAccess: true,
  });

  return Response.json({ ok: true, registration: updated });
}
