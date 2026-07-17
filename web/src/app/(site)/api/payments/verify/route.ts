import { getPayloadClient } from "@/lib/payload";
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
    const verified = await paystackVerify(reference);
    if (verified.status !== "success") {
      return Response.json({ ok: false, status: verified.status || "failed" });
    }
    const payload = await getPayloadClient();
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
