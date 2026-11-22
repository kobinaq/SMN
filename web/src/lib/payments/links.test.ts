import { describe, expect, it } from "vitest";
import { validatePaymentLinks } from "@/lib/payments/links";

describe("validatePaymentLinks", () => {
  it("requires a cohort for cohort payments", () => {
    expect(validatePaymentLinks({ kind: "cohort" })).toEqual(expect.any(String));
    expect(validatePaymentLinks({ kind: "cohort", cohort: 1 })).toBe(true);
    expect(validatePaymentLinks({ kind: "cohort", cohort: { id: 1 } })).toBe(true);
  });
  it("rejects a cohort on one-on-one", () => {
    expect(validatePaymentLinks({ kind: "one-on-one", cohort: 1 })).toEqual(expect.any(String));
    expect(validatePaymentLinks({ kind: "one-on-one" })).toBe(true);
  });
  it("rejects a cohort on other kinds", () => {
    expect(validatePaymentLinks({ kind: "event", cohort: 1 })).toEqual(expect.any(String));
    expect(validatePaymentLinks({ kind: "course" })).toBe(true);
  });
});
