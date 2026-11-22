import { describe, expect, it, vi } from "vitest";
import { fulfillSuccessfulPayment } from "@/lib/payments/fulfill";

describe("fulfillSuccessfulPayment", () => {
  it("is a no-op when the payment is already success", async () => {
    const payload = {
      find: vi.fn().mockResolvedValue({
        docs: [{ id: 4, status: "success", kind: "course", paystackReference: "ref_1" }],
      }),
      findByID: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    };
    const result = await fulfillSuccessfulPayment(payload as never, "ref_1");
    expect(result).toMatchObject({ ok: true, already: true });
    expect(payload.find).toHaveBeenCalledTimes(1);
    expect(payload.update).not.toHaveBeenCalled();
  });

  it("returns not found when the reference is unknown", async () => {
    const payload = {
      find: vi.fn().mockResolvedValue({ docs: [] }),
      findByID: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    };
    const result = await fulfillSuccessfulPayment(payload as never, "missing");
    expect(result).toEqual({ ok: false, reason: "payment_not_found" });
  });

  it.each(["cohort", "one-on-one"])("leaves a %s payment untouched", async (kind) => {
    const payload = {
      find: vi.fn().mockResolvedValue({
        docs: [{ id: 5, status: "initialized", kind, paystackReference: "ref_2" }],
      }),
      findByID: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    };
    const result = await fulfillSuccessfulPayment(payload as never, "ref_2");
    expect(result).toEqual({ ok: false, reason: "kind_not_fulfilled_yet" });
    expect(payload.update).not.toHaveBeenCalled();
    expect(payload.create).not.toHaveBeenCalled();
  });
});
