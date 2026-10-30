import { describe, expect, it } from "vitest";
import { pageTitle, seoTitle } from "@/lib/brand";
import { site } from "@/lib/site";

describe("pageTitle and seoTitle", () => {
  it("builds public titles with the full site name", () => {
    expect(seoTitle("Contact")).toEqual({
      absolute: `Contact | ${site.name}`,
    });
    expect(pageTitle("Contact", { area: "public" })).toEqual({
      absolute: `Contact | ${site.name}`,
    });
    expect(seoTitle("Sign in").absolute).toBe(`Sign in | ${site.name}`);
    expect(seoTitle("Create account").absolute).toBe(`Create account | ${site.name}`);
    expect(site.name).toBe("Think Social Academy");
  });

  it("builds portal titles from the short brand name", () => {
    expect(pageTitle("Event ticket")).toEqual({
      absolute: `Event ticket | ${site.shortName}`,
    });
    expect(pageTitle("Event ticket", { area: "portal" })).toEqual({
      absolute: `Event ticket | ${site.shortName}`,
    });
  });

  it("builds staff titles with the Staff suffix", () => {
    expect(pageTitle("People", { staff: true })).toEqual({
      absolute: `People | ${site.shortName} Staff`,
    });
    expect(pageTitle("People", { area: "staff" })).toEqual({
      absolute: `People | ${site.shortName} Staff`,
    });
  });
});
