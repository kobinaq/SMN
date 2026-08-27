import { describe, expect, it } from "vitest";
import { scoreJob, type ImportedJob } from "./opportunity-sync";

function job(overrides: Partial<ImportedJob>): ImportedJob {
  return {
    externalId: "1",
    title: "Untitled role",
    company: "Acme",
    description: "",
    location: "Accra, Ghana",
    applicationUrl: "https://example.com/apply",
    ...overrides,
  };
}

describe("scoreJob", () => {
  it("passes a job whose department is marketing", () => {
    const score = scoreJob(job({ title: "Growth Lead", department: "Marketing", description: "" }));
    expect(score).toBeGreaterThan(0);
  });

  it("rejects a non-marketing department even if the body mentions a marketing term", () => {
    const score = scoreJob(
      job({
        title: "Software Engineer",
        department: "Engineering",
        description: "You'll partner closely with our marketing team on growth experiments.",
      }),
    );
    expect(score).toBe(0);
  });

  it("passes a job with no department data when the title itself is marketing", () => {
    const score = scoreJob(job({ title: "Content Marketing Manager", description: "" }));
    expect(score).toBeGreaterThan(0);
  });

  it("rejects a job with no department data and no title match, even with marketing terms in the body", () => {
    // This is the exact leak being fixed: a non-marketing title that happens
    // to mention marketing-adjacent words in its description.
    const score = scoreJob(
      job({
        title: "Sales Development Representative",
        description: "You will work with the growth and community team, and support our CRM rollout.",
      }),
    );
    expect(score).toBe(0);
  });

  it("rejects an excluded title even when a marketing term also appears in the title", () => {
    const score = scoreJob(
      job({
        title: "Senior Software Engineer, Marketing Platform",
        description: "Build the internal tools the marketing team relies on.",
      }),
    );
    expect(score).toBe(0);
  });

  it("gives a higher score to a title match reinforced by body mentions", () => {
    const bare = scoreJob(job({ title: "Marketing Manager", description: "" }));
    const reinforced = scoreJob(
      job({
        title: "Marketing Manager",
        description: "You'll own brand, content and paid media strategy end to end.",
      }),
    );
    expect(reinforced).toBeGreaterThan(bare);
  });
});
