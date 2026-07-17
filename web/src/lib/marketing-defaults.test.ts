import { describe, expect, it } from "vitest";
import { cta } from "@/lib/cta";
import { site } from "@/lib/site";
import { courses, stories } from "@/lib/content";

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

  it("keeps apply / purchase / sign-in terminology distinct", () => {
    expect(cta.applyCohort.href).toBe("/apply");
    expect(cta.buyCourse.label).toMatch(/Enroll/i);
    expect(cta.memberSignIn.href).toBe("/login");
    expect(cta.hireTalent.href).toBe("/employers");
  });
});
