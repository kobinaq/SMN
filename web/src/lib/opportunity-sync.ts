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
};

type ImportedJob = {
  externalId: string;
  title: string;
  company: string;
  description: string;
  location: string;
  applicationUrl: string;
  employmentType?: string;
  remote?: boolean;
  salary?: string;
};

const marketingTerms = ["marketing", "brand", "content", "social media", "communications", "community", "growth", "seo", "paid media", "performance marketing", "crm", "lifecycle", "copywriter", "creative strategist", "demand generation", "product marketing"];

function clean(value: unknown) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
function scoreJob(job: ImportedJob) {
  const title = job.title.toLowerCase();
  const body = `${job.title} ${job.description}`.toLowerCase();
  return marketingTerms.reduce((score, term) => score + (title.includes(term) ? 3 : body.includes(term) ? 1 : 0), 0);
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
    const data = await response.json() as { jobs?: Array<{ id: number; title: string; content?: string; absolute_url: string; location?: { name?: string } }> };
    return (data.jobs || []).map((job) => ({ externalId: String(job.id), title: clean(job.title), company: source.name, description: clean(job.content), location: clean(job.location?.name) || source.defaultLocation || "Unspecified", applicationUrl: job.absolute_url }));
  }
  if (source.type === "lever") {
    const response = await fetch(`https://api.lever.co/v0/postings/${encodeURIComponent(source.boardToken)}?mode=json`, { signal });
    if (!response.ok) throw new Error(`Lever returned ${response.status}`);
    const data = await response.json() as Array<{ id: string; text: string; descriptionPlain?: string; hostedUrl: string; categories?: { location?: string; commitment?: string } }>;
    return data.map((job) => ({ externalId: job.id, title: clean(job.text), company: source.name, description: clean(job.descriptionPlain), location: clean(job.categories?.location) || source.defaultLocation || "Unspecified", applicationUrl: job.hostedUrl, employmentType: job.categories?.commitment }));
  }
  const response = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(source.boardToken)}?includeCompensation=true`, { signal });
  if (!response.ok) throw new Error(`Ashby returned ${response.status}`);
  const data = await response.json() as { jobs?: Array<{ id?: string; title: string; descriptionPlain?: string; descriptionHtml?: string; location?: string; jobUrl: string; employmentType?: string; isRemote?: boolean; compensationTierSummary?: string }> };
  return (data.jobs || []).map((job) => ({ externalId: job.id || job.jobUrl, title: clean(job.title), company: source.name, description: clean(job.descriptionPlain || job.descriptionHtml), location: clean(job.location) || source.defaultLocation || "Unspecified", applicationUrl: job.jobUrl, employmentType: job.employmentType, remote: job.isRemote, salary: clean(job.compensationTierSummary) || undefined }));
}

export async function syncOpportunitySource(payload: Payload, source: SourceDoc) {
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
      await payload.create({ collection: "opportunities", overrideAccess: true, data: { ...common, slug: `${slugify(job.company)}-${slugify(job.title)}-${slugify(job.externalId).slice(-12)}`, source: source.id, sourceLabel: "imported", status: source.autoPublish ? "published" : "pending", publishedAt: source.autoPublish ? now : undefined } });
      created++;
    }
  }

  const previous = await payload.find({ collection: "opportunities", limit: 1000, depth: 0, overrideAccess: true, where: { and: [{ source: { equals: source.id } }, { status: { in: ["pending", "published"] } }] } });
  for (const job of previous.docs) {
    if (job.externalId && !seen.includes(job.externalId)) await payload.update({ collection: "opportunities", id: job.id, overrideAccess: true, data: { status: job.status === "published" ? "closed" : "archived" } });
  }
  await payload.update({ collection: "opportunity-sources", id: source.id, overrideAccess: true, data: { lastSyncedAt: now, lastError: null } });
  return { source: source.name, fetched: jobs.length, created, updated, skipped };
}

export async function syncAllOpportunitySources(payload: Payload) {
  const sources = await payload.find({ collection: "opportunity-sources", limit: 100, depth: 0, overrideAccess: true, where: { enabled: { equals: true } } });
  const results = [];
  for (const source of sources.docs) {
    try { results.push(await syncOpportunitySource(payload, source as SourceDoc)); }
    catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error";
      await payload.update({ collection: "opportunity-sources", id: source.id, overrideAccess: true, data: { lastSyncedAt: new Date().toISOString(), lastError: message } });
      results.push({ source: source.name, error: message });
    }
  }
  return results;
}