import { describe, expect, it } from "vitest";
import { FEE_PENDING_LABEL } from "@/lib/currency";
import {
  blogBodyFromCms,
  cohortFromLmsDoc,
  pickFeaturedCohort,
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

describe("cohortFromLmsDoc", () => {
  const fallback = {
    name: "Fallback cohort",
    startDate: "September 2026",
    applicationDeadline: "Rolling",
    duration: "8 weeks",
    seats: 30,
    format: "Live classes",
    sessions: "2 live sessions",
    priceLabel: FEE_PENDING_LABEL,
    priceNote: "Payment after acceptance.",
    priceConfirmed: false,
    audience: "Early-career marketers",
  };

  it("withholds fees until staff confirm them on the LMS course", () => {
    const cohort = cohortFromLmsDoc(
      { id: 1, title: "Flagship", priceLabel: "GH₵2,500", priceConfirmed: false, featured: true },
      fallback,
    );
    expect(cohort.name).toBe("Flagship");
    expect(cohort.priceLabel).toBe(FEE_PENDING_LABEL);
    expect(cohort.featured).toBe(true);
  });

  it("formats a confirmed fee from the LMS course", () => {
    const cohort = cohortFromLmsDoc(
      { id: 2, title: "Flagship", priceLabel: "GHS 2500", priceConfirmed: true },
      fallback,
    );
    expect(cohort.priceLabel).toBe("GH₵2,500");
    expect(cohort.priceConfirmed).toBe(true);
  });
});

describe("pickFeaturedCohort", () => {
  it("prefers the featured published cohort", () => {
    const a = cohortFromLmsDoc({ id: 1, title: "A", featured: false }, {
      name: "Fallback",
      startDate: "x",
      applicationDeadline: "x",
      duration: "x",
      seats: 1,
      format: "x",
      sessions: "x",
      priceLabel: FEE_PENDING_LABEL,
      priceNote: "x",
      priceConfirmed: false,
      audience: "x",
    });
    const b = cohortFromLmsDoc({ id: 2, title: "B", featured: true }, a);
    expect(pickFeaturedCohort([a, b])?.id).toBe(2);
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
