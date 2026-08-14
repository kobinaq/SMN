import { describe, expect, it } from "vitest";
import { createHmac } from "crypto";
import { verifyPaystackWebhookSignature } from "@/lib/payments/paystack";

describe("verifyPaystackWebhookSignature", () => {
  it("accepts a matching HMAC and rejects a mismatch", () => {
    const previous = process.env.PAYSTACK_WEBHOOK_SECRET;
    process.env.PAYSTACK_WEBHOOK_SECRET = "whsec-test";
    const body = '{"event":"charge.success"}';
    const good = createHmac("sha512", "whsec-test").update(body).digest("hex");
    expect(verifyPaystackWebhookSignature(body, good)).toBe(true);
    expect(verifyPaystackWebhookSignature(body, "nope")).toBe(false);
    expect(verifyPaystackWebhookSignature(body, null)).toBe(false);
    if (previous === undefined) delete process.env.PAYSTACK_WEBHOOK_SECRET;
    else process.env.PAYSTACK_WEBHOOK_SECRET = previous;
  });
});
