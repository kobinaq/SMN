import { describe, expect, it } from "vitest";
import { cta } from "@/lib/cta";
import { site, nav } from "@/lib/site";
import { courses, excerptStoryQuote, stories } from "@/lib/content";

describe("marketing defaults", () => {
  it("withholds unconfirmed cohort pricing", () => {
    expect(site.cohort.priceConfirmed).toBe(false);
    expect(site.cohort.priceLabel.toLowerCase()).toContain("contact smn");
    expect(site.cohort.priceLabel).not.toMatch(/250,?000/);
  });

  it("withholds unconfirmed course seed prices", () => {
    for (const course of courses) {
      expect(course.price).not.toMatch(/45,?000|38,?000|42,?000/);
      expect(course.price.toLowerCase()).toMatch(/checkout|contact|price/);
    }
  });

  it("does not ship seed testimonials as public fallbacks", () => {
    expect(stories).toEqual([]);
  });

  it("shortens homepage story quotes without changing the full quote", () => {
    const full =
      "SMN gave me a way to talk about my work that finally made sense to clients, and the community kept me shipping when I would have stalled.";
    const excerpt = excerptStoryQuote(full, 80);
    expect(excerpt.length).toBeLessThan(full.length);
    expect(excerpt.endsWith("…")).toBe(true);
    expect(excerptStoryQuote("Short quote.")).toBe("Short quote.");
  });

  it("keeps apply / purchase / sign-in terminology distinct", () => {
    expect(cta.applyCohort.href).toBe("/apply");
    expect(cta.buyCourse.label).toMatch(/Enroll/i);
    expect(cta.memberSignIn.href).toBe("/login");
    expect(cta.hireTalent.href).toBe("/employers");
    expect(cta.hireTalent.label).toMatch(/Hire SMN talent/i);
  });

  it("exposes Experience and Partners in public navigation", () => {
    const academy = nav.find((item) => item.label === "Academy");
    const partners = nav.find((item) => item.label === "Partners");
    expect(academy && "children" in academy && academy.children.some((child) => child.href === "/experience")).toBe(
      true,
    );
    expect(partners?.href).toBe("/employers");
  });
});
