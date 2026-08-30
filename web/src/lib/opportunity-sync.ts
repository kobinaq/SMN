import { createHash } from "node:crypto";
import type { Payload } from "payload";

type SourceDoc = {
  id: string | number;
  name: string;
  type: "greenhouse" | "lever" | "ashby";
  boardToken: string;
  enabled?: boolean | null;
  autoPublish?: boolean | null;
  minimumScore?: number | null;
  defaultLocation?: string | null;
  consecutiveFailures?: number | null;
};

export type ImportedJob = {
  externalId: string;
  title: string;
  company: string;
  description: string;
  location: string;
  applicationUrl: string;
  employmentType?: string;
  remote?: boolean;
  salary?: string;
  /** The board's own department/team label, when the ATS exposes one. */
  department?: string;
};

/**
 * Relevance is decided in two tiers, in order:
 *
 * 1. The board's own department label, when present — an employer who filed
 *    a job under "Marketing" has already made the call more reliably than any
 *    keyword guess could.
 * 2. A text fallback, gated on the TITLE (not the description body). The old
 *    scorer credited body-only mentions on their own, which is how postings
 *    like a Software Engineer role that name-drops "our marketing team" once
 *    made it past the default threshold — a title match is now required
 *    before body text adds anything, and matching is word-boundary, not
 *    substring, so "crm" can't fire inside an unrelated word.
 */
const marketingDepartmentTerms = ["marketing", "brand", "content", "growth marketing", "communications", "demand generation", "product marketing"];

const marketingTitleTerms = ["marketing", "brand", "content", "social media", "seo", "paid media", "performance marketing", "copywriter", "creative strategist", "demand generation", "product marketing", "growth marketing", "marketing communications", "community manager", "email marketing", "influencer marketing", "advertising"];

/** Title words that mean "not marketing" even if a term above also matches. */
const excludedTitleTerms = ["engineer", "developer", "software", "accountant", "data scientist", "data analyst", "financial analyst", "recruiter", "warehouse", "driver", "nurse", "legal counsel", "devops", "backend", "frontend", "customer support"];

/**
 * Some boards (Ashby in particular) hand back their HTML already
 * entity-escaped — `&lt;p&gt;&lt;strong&gt;Summary&lt;/strong&gt;&lt;/p&gt;`
 * as literal text rather than real `<p><strong>` tags. Stripping tags before
 * decoding entities leaves that markup sitting in the description as visible
 * junk, since `&lt;p&gt;` doesn't look like a tag to a tag-stripping regex.
 * Decoding first turns it into real tags so the strip pass below can remove it
 * either way.
 */
function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&");
}
export function clean(value: unknown) {
  return decodeEntities(String(value || "")).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function wordMatch(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}
function matchesAny(text: string, terms: string[]) {
  return terms.some((term) => wordMatch(text, term));
}
export function scoreJob(job: ImportedJob) {
  if (job.department) return matchesAny(job.department, marketingDepartmentTerms) ? 10 : 0;
  if (matchesAny(job.title, excludedTitleTerms)) return 0;
  if (!matchesAny(job.title, marketingTitleTerms)) return 0;
  // Title already confirms relevance; extra body mentions only add signal.
  let score = 5;
  for (const term of marketingTitleTerms) {
    if (!wordMatch(job.title, term) && wordMatch(job.description, term)) score += 1;
  }
  return score;
}
function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
}
function fingerprint(job: ImportedJob) {
  return createHash("sha256").update(`${job.company}|${job.title}|${job.location}`.toLowerCase().replace(/\s+/g, " ")).digest("hex");
}
function inferType(value = "") {
  const text = value.toLowerCase();
  if (text.includes("intern")) return "Internship" as const;
  if (text.includes("freelance")) return "Freelance" as const;
  if (text.includes("contract")) return "Contract" as const;
  if (text.includes("part")) return "Part-time" as const;
  return "Full-time" as const;
}
function inferExperience(title: string) {
  const value = title.toLowerCase();
  if (/chief|head|director|vp|vice president|lead/.test(value)) return "Lead / Head" as const;
  if (/senior|sr\.|principal|manager/.test(value)) return "Senior" as const;
  if (/junior|jr\.|associate|graduate|intern/.test(value)) return "Entry level" as const;
  return "Any level" as const;
}

async function fetchJobs(source: SourceDoc): Promise<ImportedJob[]> {
  const signal = AbortSignal.timeout(20_000);
  if (source.type === "greenhouse") {
    const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(source.boardToken)}/jobs?content=true`, { signal });
    if (!response.ok) throw new Error(`Greenhouse returned ${response.status}`);
    const data = await response.json() as { jobs?: Array<{ id: number; title: string; content?: string; absolute_url: string; location?: { name?: string }; departments?: Array<{ name?: string }> }> };
    return (data.jobs || []).map((job) => ({ externalId: String(job.id), title: clean(job.title), company: source.name, description: clean(job.content), location: clean(job.location?.name) || source.defaultLocation || "Unspecified", applicationUrl: job.absolute_url, department: clean(job.departments?.[0]?.name) || undefined }));
  }
  if (source.type === "lever") {
    const response = await fetch(`https://api.lever.co/v0/postings/${encodeURIComponent(source.boardToken)}?mode=json`, { signal });
    if (!response.ok) throw new Error(`Lever returned ${response.status}`);
    const data = await response.json() as Array<{ id: string; text: string; descriptionPlain?: string; hostedUrl: string; categories?: { location?: string; commitment?: string; team?: string; department?: string } }>;
    return data.map((job) => ({ externalId: job.id, title: clean(job.text), company: source.name, description: clean(job.descriptionPlain), location: clean(job.categories?.location) || source.defaultLocation || "Unspecified", applicationUrl: job.hostedUrl, employmentType: job.categories?.commitment, department: clean(job.categories?.team || job.categories?.department) || undefined }));
  }
  const response = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(source.boardToken)}?includeCompensation=true`, { signal });
  if (!response.ok) throw new Error(`Ashby returned ${response.status}`);
  const data = await response.json() as { jobs?: Array<{ id?: string; title: string; descriptionPlain?: string; descriptionHtml?: string; location?: string; jobUrl: string; employmentType?: string; isRemote?: boolean; compensationTierSummary?: string; department?: string; team?: string }> };
  return (data.jobs || []).map((job) => ({ externalId: job.id || job.jobUrl, title: clean(job.title), company: source.name, description: clean(job.descriptionPlain || job.descriptionHtml), location: clean(job.location) || source.defaultLocation || "Unspecified", applicationUrl: job.jobUrl, employmentType: job.employmentType, remote: job.isRemote, salary: clean(job.compensationTierSummary) || undefined, department: clean(job.department || job.team) || undefined }));
}

export async function syncOpportunitySource(payload: Payload, source: SourceDoc) {
  const started = Date.now();
  const now = new Date().toISOString();
  const jobs = await fetchJobs(source);
  const seen: string[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const job of jobs) {
    const relevanceScore = scoreJob(job);
    if (relevanceScore < (source.minimumScore || 2) || !job.applicationUrl.startsWith("http")) { skipped++; continue; }
    seen.push(job.externalId);
    const existing = await payload.find({ collection: "opportunities", limit: 1, depth: 0, overrideAccess: true, where: { and: [{ source: { equals: source.id } }, { externalId: { equals: job.externalId } }] } });
    const description = job.description.slice(0, 12_000);
    const common = {
      title: job.title, company: job.company, summary: description.slice(0, 320) || `${job.title} opportunity at ${job.company}.`, description,
      type: inferType(job.employmentType || job.title), workMode: job.remote || /remote/i.test(job.location) ? "Remote" as const : "Unspecified" as const,
      experienceLevel: inferExperience(job.title), location: job.location, salary: job.salary,
      applicationUrl: job.applicationUrl, externalId: job.externalId, fingerprint: fingerprint(job), relevanceScore, lastSeenAt: now,
    };
    if (existing.docs[0]) {
      await payload.update({ collection: "opportunities", id: existing.docs[0].id, overrideAccess: true, data: common });
      updated++;
    } else {
      const duplicate = await payload.find({ collection: "opportunities", limit: 1, depth: 0, overrideAccess: true, where: { fingerprint: { equals: common.fingerprint } } });
      if (duplicate.totalDocs) { skipped++; continue; }
      await payload.create({ collection: "opportunities", overrideAccess: true, data: { ...common, slug: `${slugify(job.company)}-${slugify(job.title)}-${slugify(job.externalId).slice(-12)}`, source: Number(source.id), sourceLabel: "imported", status: source.autoPublish ? "published" : "pending", publishedAt: source.autoPublish ? now : undefined } });
      created++;
    }
  }

  const previous = await payload.find({ collection: "opportunities", limit: 1000, depth: 0, overrideAccess: true, where: { and: [{ source: { equals: source.id } }, { status: { in: ["pending", "published"] } }] } });
  for (const job of previous.docs) {
    if (job.externalId && !seen.includes(job.externalId)) await payload.update({ collection: "opportunities", id: job.id, overrideAccess: true, data: { status: job.status === "published" ? "closed" : "archived" } });
  }
  await payload.update({ collection: "opportunity-sources", id: source.id, overrideAccess: true, data: { lastSyncedAt: now, lastError: null, consecutiveFailures: 0, lastFetchedCount: jobs.length, lastCreatedCount: created, lastUpdatedCount: updated, lastSkippedCount: skipped, lastDurationMs: Date.now() - started } });
  return { source: source.name, fetched: jobs.length, created, updated, skipped };
}

export async function syncAllOpportunitySources(payload: Payload) {
  const sources = await payload.find({ collection: "opportunity-sources", limit: 100, depth: 0, overrideAccess: true, where: { enabled: { equals: true } } });
  const results = [];
  for (const source of sources.docs) {
    try { results.push(await syncOpportunitySource(payload, source as SourceDoc)); }
    catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error";
      await payload.update({ collection: "opportunity-sources", id: source.id, overrideAccess: true, data: { lastSyncedAt: new Date().toISOString(), lastError: message, consecutiveFailures: Number(source.consecutiveFailures || 0) + 1 } });
      results.push({ source: source.name, error: message });
    }
  }
  return results;
}
