import { describe, expect, it } from "vitest";
import { resourceTypes } from "@/lib/content";
import * as resources from "@/lib/pages/resources";
import { findCopyViolations } from "@/lib/pages/copy-rules";

describe("Resources and Insights copy (T9)", () => {
  it("uses the Tab 4 hero", () => {
    expect(resources.resourcesHero.title).toBe("Keep learning.");
    expect(resources.resourcesHero.lede).toBe(
      "Practical resources to help you think, create and work better in social media marketing.",
    );
  });

  it("follows Tab 5 copy rules", () => {
    expect(findCopyViolations(resources)).toEqual([]);
  });

  it("lists the six Tab 4 categories", () => {
    expect(resources.resourceCategories.map((category) => category.title)).toEqual([
      "Articles",
      "Guides",
      "Templates",
      "Tools",
      "Case Studies",
      "Webinars & Insights",
    ]);
  });

  it("points library categories at real resource type filters", () => {
    for (const category of resources.resourceCategories) {
      const match = category.href.match(/^\/resources\?type=(.+)$/);
      if (match) expect(resourceTypes).toContain(decodeURIComponent(match[1]));
      else expect(category.href).toMatch(/^\/(insights|events)(\?category=.+)?$/);
    }
  });

  it("splits public and member resources, with Join TSA going to signup", () => {
    expect(resources.resourceAccess.public.title).toBe("Public resources");
    expect(resources.resourceAccess.member.title).toBe("Member resources");
    expect(resources.resourceAccess.member.href).toBe("/signup");
    expect(resources.resourceAccess.member.body).toMatch(/programme materials/);
    expect(resources.resourceAccess.member.body).not.toMatch(/as they are published|member portal|members-only/i);
    expect(resources.resourceAccess.member.secondaryHref).toBe("/login");
  });

  it("drops career resources from the library list", () => {
    expect(resources.resourceLibraryContents.join(" ")).not.toMatch(/career/i);
  });
});
