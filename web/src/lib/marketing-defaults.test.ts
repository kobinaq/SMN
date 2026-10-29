import { describe, expect, it } from "vitest";
import { cta } from "@/lib/cta";
import { site, nav } from "@/lib/site";
import { courses, excerptStoryQuote, homepageHero, smnValues, stories } from "@/lib/content";

describe("marketing defaults", () => {
  it("withholds unconfirmed cohort pricing", () => {
    expect(site.cohort.priceConfirmed).toBe(false);
    expect(site.cohort.priceLabel.toLowerCase()).toContain("contact tsa");
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
    expect(cta.joinTsa.href).toBe("/signup");
    expect(cta.joinTsa.label).toBe("Join TSA");
    expect(cta.joinCommunity.href).toBe("/signup");
    expect(cta.joinCommunity.label).toBe("Join the Community");
    expect(cta.whatsapp.communityLabel).toMatch(/whatsapp/i);
    expect(cta.hireTalent.href).toBe("/community");
    expect(cta.postJob.href).toBe("/community");
    expect(cta.requestIntern.href).toBe("/community");
    expect(cta.viewMentors.href).toBe("/community/mentors");
    expect(cta.exploreServices.label).toBe("Explore our Services");
    expect(cta.exploreServices.href).toBe("/academy");
  });

  it("uses a 4-week cohort duration in public defaults", () => {
    expect(site.cohort.duration).toBe("4 weeks");
    expect(site.homepage.secondaryCtaHref).toBe("/signup");
  });

  it("exposes the T3 public navigation labels and hrefs", () => {
    expect(nav.map((item) => item.label)).toEqual([
      "Home",
      "Academy",
      "Community",
      "Partner With Us",
      "Resources",
      "About",
    ]);
    expect(nav.find((item) => item.label === "Academy")?.href).toBe("/academy");
    expect(nav.find((item) => item.label === "Partner With Us")?.href).toBe("/partner");
    expect(nav.find((item) => item.label === "Resources")?.href).toBe("/resources");
    const community = nav.find((item) => item.label === "Community");
    expect(
      community && "children" in community && community.children.some((child) => child.href === "/community/mentors"),
    ).toBe(true);
  });

  it("keeps homepage hero promise and values in code", () => {
    expect(homepageHero.lines).toEqual([
      "Learn Social Media Marketing.",
      "Lead with AI.",
      "Gain Real-World Experience.",
      "Grow with Community",
    ]);
    expect(smnValues.map((value) => value.title)).toEqual([
      "Practicality",
      "Strategy over aesthetics",
      "Community",
      "Relevance",
      "Opportunity",
    ]);
  });
});
