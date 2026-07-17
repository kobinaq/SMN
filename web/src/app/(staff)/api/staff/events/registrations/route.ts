import { z } from "zod";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";
import { getPayloadClient } from "@/lib/payload";
import { cancelEventRegistration } from "@/lib/payments/fulfill";

const schema = z.object({
  registrationId: z.union([z.string(), z.number()]),
  action: z.enum(["cancel", "cancel_refund"]),
});

export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await staffAuthHeaders() });
    if (!user || user.collection !== "users") {
      return Response.json({ error: "Staff sign-in required." }, { status: 401 });
    }
    if (!canStaff(user as never, "content", "support", "super-admin")) {
      return Response.json({ error: "Not allowed." }, { status: 403 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const result = await cancelEventRegistration(payload, parsed.data.registrationId, {
      refund: parsed.data.action === "cancel_refund",
    });

    return Response.json({
      ok: true,
      status: result.registration.status,
      refunded: result.refunded,
    });
  } catch (error) {
    console.error("[staff-event-registration]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to update registration." },
      { status: 500 },
    );
  }
}
