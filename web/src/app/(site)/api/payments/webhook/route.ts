import { getPayloadClient } from "@/lib/payload";
import { fulfillSuccessfulPayment } from "@/lib/payments/fulfill";
import { verifyPaystackWebhookSignature } from "@/lib/payments/paystack";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: string; status?: string };
    };

    if (event.event === "charge.success" && event.data?.reference) {
      const payload = await getPayloadClient();
      await fulfillSuccessfulPayment(payload, event.data.reference);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[payments-webhook]", error);
    return Response.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
