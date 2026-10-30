import { describe, expect, it } from "vitest";
import { cohortAudienceSentence, cohortDeadlineSentence } from "@/lib/cohort-copy";
import { site } from "@/lib/site";

describe("cohortAudienceSentence", () => {
  it("lowercases the leading word so the sentence reads 'For aspiring ...'", () => {
    expect(cohortAudienceSentence(site.cohort.audience)).toMatch(
      /^For aspiring social media managers,/,
    );
    expect(cohortAudienceSentence("Aspiring marketers")).toBe("For aspiring marketers.");
  });

  it("keeps acronyms and does not double the full stop", () => {
    expect(cohortAudienceSentence("TSA members.")).toBe("For TSA members.");
  });
});

describe("cohortDeadlineSentence", () => {
  it("turns a rolling deadline into 'Applications are rolling. Apply early.'", () => {
    expect(cohortDeadlineSentence(site.cohort.applicationDeadline)).toBe(
      "Applications are rolling. Apply early.",
    );
    expect(cohortDeadlineSentence("rolling")).toBe("Applications are rolling. Apply early.");
    expect(cohortDeadlineSentence("")).toBe("Applications are rolling. Apply early.");
  });

  it("keeps 'Apply by' for a real date", () => {
    expect(cohortDeadlineSentence("15 January 2027")).toBe("Apply by 15 January 2027.");
  });
});
