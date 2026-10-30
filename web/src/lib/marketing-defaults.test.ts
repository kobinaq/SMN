import { describe, expect, it } from "vitest";
import { cohortStartLabel } from "@/lib/cohort-copy";
import { cta } from "@/lib/cta";
import { site, nav } from "@/lib/site";
import { courses, excerptStoryQuote, homepageHeadlineLines, stories } from "@/lib/content";
import { homepageOfferings } from "@/lib/pages/home";

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

  it("keeps apply / learn / connect CTAs distinct", () => {
    expect(cta.applyCohort.href).toBe("/apply");
    expect(cta.buyCourse.label).toMatch(/Enroll/i);
    expect(cta.memberSignIn.href).toBe("/login");
    expect(cta.joinTsa.href).toBe("/signup");
    expect(cta.joinCommunity.href).toBe("/connect");
    expect(cta.joinCommunity.label).toBe("Join the community");
    expect(cta.hireTalent.href).toBe("/connect");
    expect(cta.viewMentors.href).toBe("/connect/mentors");
    expect(cta.explorePrograms.label).toBe("Explore our programmes");
    expect(cta.explorePrograms.href).toBe("/learn");
    expect(cta.viewCohort.href).toBe("/learn/social-media-marketing-ai-programme");
  });

  it("uses Website Structure doc home CTAs and cohort duration", () => {
    expect(site.cohort.duration).toBe("4 weeks");
    expect(site.cohort.startDate).toBe("");
    expect(cohortStartLabel(site.cohort.startDate).toLowerCase()).toContain("coming soon");
    expect(site.homepage.primaryCtaLabel).toBe("Explore our programmes");
    expect(site.homepage.primaryCtaHref).toBe("/learn");
    expect(site.homepage.secondaryCtaLabel).toBe("Apply for the next cohort");
    expect(site.homepage.secondaryCtaHref).toBe("/apply");
  });

  it("exposes Learn / Grow / Connect navigation", () => {
    expect(nav.map((item) => item.label)).toEqual([
      "Home",
      "Learn",
      "Grow",
      "Connect",
      "Partner With Us",
      "About",
    ]);
    expect(nav.find((item) => item.label === "Learn")?.href).toBe("/learn");
    expect(nav.find((item) => item.label === "Grow")?.href).toBe("/grow");
    expect(nav.find((item) => item.label === "Partner With Us")?.href).toBe("/partner");
    const connect = nav.find((item) => item.label === "Connect");
    expect(
      connect && "children" in connect && connect.children.some((child) => child.href === "/connect/mentors"),
    ).toBe(true);
  });

  it("keeps homepage offerings on Learn routes from the website doc", () => {
    expect(homepageHeadlineLines(site.homepage.headline)[0]).toContain("deliver results");
    expect(homepageOfferings.items.map((item) => item.href)).toEqual([
      "/learn/social-media-marketing-ai-programme",
      "/learn/one-on-one-training",
      "/learn/organisational-training",
    ]);
  });
});
