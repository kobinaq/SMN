import { describe, expect, it } from "vitest";
import { checkoutCourseGate, paymentStatusAfterFailedDelivery, relationId } from "@/lib/payments/checkout";

describe("checkoutCourseGate", () => {
  const ready = { status: "published", amount: 25000, lmsCourse: 12, lmsStatus: "published" };

  it("requires a published LMS course before checkout", () => {
    expect(checkoutCourseGate({ ...ready, lmsCourse: null }).ok).toBe(false);
    expect(checkoutCourseGate({ ...ready, lmsStatus: "draft" }).ok).toBe(false);
    expect(checkoutCourseGate(ready)).toEqual({ ok: true, lmsId: "12", amount: 25000 });
  });

  it("blocks coming-soon catalogue rows", () => {
    const result = checkoutCourseGate({ ...ready, status: "coming-soon" });
    expect(result.ok).toBe(false);
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
