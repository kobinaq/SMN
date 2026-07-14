import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

type OpportunityDoc = {
  id: string | number;
  slug: string;
  title: string;
  company: string;
  summary: string;
  description?: string | null;
  type: string;
  workMode: string;
  experienceLevel: string;
  location: string;
  salary?: string | null;
  sourceLabel: string;
  applicationUrl?: string | null;
  publishedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
};

export type OpportunityItem = {
  id: string | number;
  slug: string;
  title: string;
  company: string;
  summary: string;
  description: string;
  type: string;
  workMode: string;
  experienceLevel: string;
  location: string;
  salary: string;
  sourceLabel: string;
  publishedAt: string;
  expiresAt: string;
  expired: boolean;
  applicationUrl: string;
};

function isExpired(expiresAt?: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
}

function mapOpportunity(doc: OpportunityDoc): OpportunityItem {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    company: doc.company,
    summary: doc.summary,
    description: doc.description || doc.summary,
    type: doc.type,
    workMode: doc.workMode,
    experienceLevel: doc.experienceLevel,
    location: doc.location,
    salary: doc.salary || "",
    sourceLabel: doc.sourceLabel,
    publishedAt: doc.publishedAt || doc.createdAt,
    expiresAt: doc.expiresAt || "",
    expired: isExpired(doc.expiresAt),
    applicationUrl: doc.applicationUrl || "",
  };
}

export async function getPublishedOpportunities() {
  const payload = await getPayloadClient();
  const now = new Date().toISOString();
  const result = await payload.find({
    collection: "opportunities",
    depth: 0,
    limit: 200,
    sort: "-publishedAt,-createdAt",
    overrideAccess: true,
    where: {
      and: [
        { status: { equals: "published" } },
        { or: [{ expiresAt: { greater_than: now } }, { expiresAt: { exists: false } }] },
      ],
    },
  });
  return result.docs.map((doc) => mapOpportunity(doc as unknown as OpportunityDoc));
}

export async function getPublishedOpportunity(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "opportunities",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { and: [{ slug: { equals: slug } }, { status: { equals: "published" } }] },
  });
  if (!result.docs[0]) notFound();
  return mapOpportunity(result.docs[0] as unknown as OpportunityDoc);
}

export async function getMemberOpportunityActivity(memberId: string | number) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "opportunity-applications",
    depth: 1,
    limit: 50,
    sort: "-createdAt",
    overrideAccess: true,
    where: { member: { equals: memberId } },
  });
  return result.docs.flatMap((record) => {
    const opportunity = typeof record.opportunity === "object" && record.opportunity ? record.opportunity : null;
    return opportunity
      ? [
          {
            id: record.id,
            status: record.status,
            title: opportunity.title,
            company: opportunity.company,
            slug: opportunity.slug,
          },
        ]
      : [];
  });
}
