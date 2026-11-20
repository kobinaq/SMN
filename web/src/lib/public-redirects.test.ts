import { describe, expect, it } from "vitest";
import { publicRedirects, redirectPath } from "@/lib/public-redirects";

const sources = new Set<string>(publicRedirects.map((rule) => rule.source));

describe("public redirects", () => {
  it("sends old hubs to final pages without chaining", () => {
    for (const rule of publicRedirects) {
      expect(sources.has(redirectPath(rule.destination)), rule.source).toBe(false);
    }
  });

  it("does not redirect pages that are still routes", () => {
    for (const path of [
      "/programs",
      "/resources",
      "/about",
      "/partnerships",
      "/agency",
      "/contact",
      "/events",
      "/apply",
      "/login",
      "/signup",
      "/connect",
    ]) {
      expect(sources.has(path)).toBe(false);
    }
  });

  it("flips Learn and Grow onto Programs and Resources", () => {
    expect(publicRedirects.find((rule) => rule.source === "/learn")?.destination).toBe("/programs");
    expect(publicRedirects.find((rule) => rule.source === "/grow")?.destination).toBe("/resources");
    expect(
      publicRedirects.find((rule) => rule.source === "/learn/social-media-marketing-ai-programme")
        ?.destination,
    ).toBe("/programs/social-media-marketing");
    expect(publicRedirects.find((rule) => rule.source === "/learn/one-on-one-training")?.destination).toBe(
      "/programs/one-on-one-training",
    );
    expect(publicRedirects.find((rule) => rule.source === "/learn/organisational-training")?.destination).toBe(
      "/programs/organisational-training",
    );
    expect(publicRedirects.find((rule) => rule.source === "/insights/:slug")?.destination).toBe(
      "/resources/:slug",
    );
    expect(publicRedirects.find((rule) => rule.source === "/partner")?.destination).toBe("/partnerships");
    expect(publicRedirects.find((rule) => rule.source === "/employers")?.destination).toBe("/partnerships");
  });

  it("sends retired careers and mentor URLs to about", () => {
    expect(publicRedirects.find((rule) => rule.source === "/careers")?.destination).toBe("/about");
    expect(publicRedirects.find((rule) => rule.source === "/careers/:path*")?.destination).toBe("/about");
    expect(publicRedirects.find((rule) => rule.source === "/mentors")?.destination).toBe("/about");
    expect(publicRedirects.find((rule) => rule.source === "/connect/mentors")?.destination).toBe("/about");
    expect(publicRedirects.find((rule) => rule.source === "/connect/mentors/:path*")?.destination).toBe("/about");
    expect(publicRedirects.find((rule) => rule.source === "/mentorship")?.destination).toBe("/about");
    expect(publicRedirects.find((rule) => rule.source === "/stories")?.destination).toBe("/about");
  });
});
