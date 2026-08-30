import { describe, expect, it } from "vitest";
import { clean, scoreJob, type ImportedJob } from "./opportunity-sync";

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

describe("clean", () => {
  it("strips real HTML tags", () => {
    expect(clean("<p><strong>Summary</strong></p><p>Body copy.</p>")).toBe("Summary Body copy.");
  });

  it("decodes entity-escaped HTML before stripping it, instead of leaving the markup visible", () => {
    // The exact shape some ATS boards (Ashby in particular) return: the HTML
    // itself is entity-escaped, so it reads as literal "&lt;p&gt;" text
    // rather than a real <p> tag until it's decoded first.
    const raw = "&lt;p&gt;&lt;strong&gt;Summary&lt;/strong&gt;&lt;/p&gt; &lt;p&gt;The role reports to the Director.&nbsp;&lt;/p&gt;";
    expect(clean(raw)).toBe("Summary The role reports to the Director.");
  });

  it("decodes common named and numeric entities", () => {
    expect(clean("Marketing &amp; Growth &mdash; 5&#39;s rule &#x2013; ok")).toBe("Marketing & Growth — 5's rule – ok");
  });
});
