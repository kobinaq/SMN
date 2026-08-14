import { describe, expect, it } from "vitest";
import { FEE_PENDING_LABEL } from "@/lib/currency";
import {
  blogBodyFromCms,
  publicList,
  resolveCohortPrice,
} from "@/lib/public-content";

describe("publicList", () => {
  const seed = [{ slug: "seed-only" }];
  const cms = [{ slug: "cms-doc" }];

  it("returns seed when seed mode is on", () => {
    expect(publicList({ useSeed: true, seed, docs: cms })).toEqual(seed);
  });

  it("returns CMS docs even when the list is empty", () => {
    expect(publicList({ useSeed: false, seed, docs: [] })).toEqual([]);
  });

  it("does not append unmatched seed slugs onto CMS results", () => {
    expect(publicList({ useSeed: false, seed, docs: cms })).toEqual(cms);
  });

  it("fails closed to empty when CMS errors in production", () => {
    expect(
      publicList({ useSeed: false, seed, docs: [], cmsFailed: true, failClosed: true }),
    ).toEqual([]);
  });
});

describe("resolveCohortPrice", () => {
  it("withholds every amount until staff confirms", () => {
    expect(resolveCohortPrice("GH₵2,500", false)).toBe(FEE_PENDING_LABEL);
    expect(resolveCohortPrice("250000", false)).toBe(FEE_PENDING_LABEL);
  });

  it("formats a confirmed fee without a banned-amount regex", () => {
    expect(resolveCohortPrice("GHS 2,500", true)).toBe("GH₵2,500");
  });
});

describe("blogBodyFromCms", () => {
  it("maps Lexical body instead of the excerpt", () => {
    const content = {
      root: {
        children: [{ children: [{ text: "The real article." }] }],
      },
    };
    expect(blogBodyFromCms(content, "Short excerpt")).toEqual(["The real article."]);
  });

  it("falls back to excerpt when Lexical is empty", () => {
    expect(blogBodyFromCms(null, "Short excerpt")).toEqual(["Short excerpt"]);
  });
});
