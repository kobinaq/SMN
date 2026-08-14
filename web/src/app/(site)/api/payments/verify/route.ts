import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { relationId } from "@/lib/payments/checkout";
import { fulfillSuccessfulPayment } from "@/lib/payments/fulfill";
import { paystackConfigured, paystackVerify } from "@/lib/payments/paystack";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");
  if (!reference) {
    return Response.json({ error: "Missing reference." }, { status: 400 });
  }
  if (!paystackConfigured()) {
    return Response.json({ error: "Payments are not configured." }, { status: 503 });
  }

  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return Response.json({ error: "Member sign-in required." }, { status: 401 });
    }

    const existing = await payload.find({
      collection: "payments",
      limit: 1,
      depth: 0,
      overrideAccess: true,
      where: { paystackReference: { equals: reference } },
    });
    const payment = existing.docs[0];
    if (!payment) {
      return Response.json({ error: "Payment not found." }, { status: 404 });
    }
    if (relationId(payment.member) !== String(user.id)) {
      return Response.json({ error: "That payment does not belong to this session." }, { status: 403 });
    }

    const verified = await paystackVerify(reference);
    if (verified.status !== "success") {
      return Response.json({ ok: false, status: verified.status || "failed" });
    }
    const result = await fulfillSuccessfulPayment(payload, reference);
    return Response.json(result);
  } catch (error) {
    console.error("[payments-verify]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Verification failed." },
      { status: 500 },
    );
  }
}
