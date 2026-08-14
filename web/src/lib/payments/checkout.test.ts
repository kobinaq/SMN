import { describe, expect, it } from "vitest";
import {
  checkoutCourseGate,
  checkoutPublishedAmountGate,
  paymentStatusAfterFailedDelivery,
  relationId,
} from "@/lib/payments/checkout";

describe("checkoutCourseGate", () => {
  const ready = { status: "published", commerce: "purchase", amount: 25000, priceConfirmed: true };

  it("allows a published buy-now course with a confirmed amount", () => {
    expect(checkoutCourseGate(ready)).toEqual({ ok: true, amount: 25000 });
  });

  it("blocks apply-first and unpriced courses", () => {
    expect(checkoutCourseGate({ ...ready, commerce: "apply" }).ok).toBe(false);
    expect(checkoutCourseGate({ ...ready, amount: 0 }).ok).toBe(false);
    expect(checkoutCourseGate({ ...ready, priceConfirmed: false }).ok).toBe(false);
    expect(checkoutCourseGate({ ...ready, status: "draft" }).ok).toBe(false);
  });
});

describe("checkoutPublishedAmountGate", () => {
  it("allows a confirmed fee on an apply-first course for staff pay links", () => {
    expect(
      checkoutPublishedAmountGate({
        status: "published",
        amount: 25000,
        priceConfirmed: true,
      }),
    ).toEqual({ ok: true, amount: 25000 });
  });
});

describe("paymentStatusAfterFailedDelivery", () => {
  it("keeps captured money visible until Paystack refunds", () => {
    expect(paymentStatusAfterFailedDelivery(false)).toBe("needs_refund");
    expect(paymentStatusAfterFailedDelivery(true)).toBe("refunded");
  });
});

describe("relationId", () => {
  it("reads populated and bare ids", () => {
    expect(relationId({ id: 9 })).toBe("9");
    expect(relationId(9)).toBe("9");
    expect(relationId(null)).toBe("");
  });
});
