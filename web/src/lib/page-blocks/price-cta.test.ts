import { describe, expect, it } from "vitest";
import { priceCta } from "./price-cta";

describe("priceCta", () => {
  it("course with an open cohort applies, default link", () => {
    const cta = priceCta({ product: "course", price: 250000, hasOpenCohort: true });
    expect(cta).toMatchObject({ label: "Apply", href: "/apply", disabled: false, price: 250000, currency: "GHS" });
  });

  it("course apply link can be overridden, blank falls back", () => {
    expect(priceCta({ product: "course", price: 1, hasOpenCohort: true, applyLink: "/apply/smm" }).href).toBe("/apply/smm");
    expect(priceCta({ product: "course", price: 1, hasOpenCohort: true, applyLink: "  " }).href).toBe("/apply");
  });

  it("course without an open cohort registers interest", () => {
    const cta = priceCta({ product: "course", price: 250000, hasOpenCohort: false, applyLink: "/apply/x" });
    expect(cta.label).toBe("Register interest");
    expect(cta.href).toBe("/contact?type=programme-social-media-marketing");
  });

  it("unpriced course keeps a null price", () => {
    expect(priceCta({ product: "course", price: null }).price).toBeNull();
  });

  it("one-on-one pay is disabled with the coming soon note", () => {
    const cta = priceCta({ product: "one-on-one", price: 500000, hasOpenCohort: true });
    expect(cta).toMatchObject({ label: "Pay", href: null, disabled: true, note: "Online payment is coming soon", price: 500000 });
  });

  it("workshops always contact sales, never a price", () => {
    const cta = priceCta({ product: "workshops", price: 999, hasOpenCohort: true });
    expect(cta).toMatchObject({
      label: "Contact sales",
      href: "/contact?type=organisational-training",
      price: null,
      currency: null,
      disabled: false,
    });
  });
});
