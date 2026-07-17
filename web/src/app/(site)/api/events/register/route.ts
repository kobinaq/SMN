import { z } from "zod";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { registerForFreeEvent } from "@/lib/payments/fulfill";

const schema = z.object({
  eventId: z.union([z.string(), z.number()]),
});

export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return Response.json({ error: "Member sign-in required." }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Event required." }, { status: 400 });
    }

    const event = await payload.findByID({
      collection: "events",
      id: parsed.data.eventId,
      depth: 0,
      overrideAccess: true,
    });

    const record = event as unknown as Record<string, unknown>;
    if (record.status !== "published") {
      return Response.json({ error: "Event is not open for registration." }, { status: 400 });
    }
    if (record.pricing === "paid") {
      return Response.json({ error: "This event requires payment." }, { status: 400 });
    }

    const registration = await registerForFreeEvent(payload, parsed.data.eventId, user.id);
    return Response.json({
      ok: true,
      id: registration.id,
      ticketCode: registration.ticketCode,
    });
  } catch (error) {
    console.error("[event-register]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to register." },
      { status: 500 },
    );
  }
}
