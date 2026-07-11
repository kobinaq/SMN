import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

type PortfolioDoc = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  skills?: { skill: string }[] | null;
  projectUrl?: string | null;
  cover?: { url?: string | null } | string | number | null;
  coverUrl?: string | null;
  status: string;
  visibility: string;
};

export type PortfolioItem = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  skills: string[];
  projectUrl: string;
  coverUrl: string;
  status: string;
  visibility: string;
};

function map(doc: PortfolioDoc): PortfolioItem {
  const cover = typeof doc.cover === "object" && doc.cover ? doc.cover : null;
  return {
    id: doc.id, title: doc.title, slug: doc.slug, summary: doc.summary,
    challenge: doc.challenge, approach: doc.approach, outcome: doc.outcome,
    skills: (doc.skills || []).map((item) => item.skill), projectUrl: doc.projectUrl || "",
    coverUrl: cover?.url || doc.coverUrl || "", status: doc.status, visibility: doc.visibility,
  };
}

export async function getMemberPortfolios(memberId: string | number) {
  const payload = await getPayloadClient();
  const result = await payload.find({ collection: "portfolios", depth: 1, limit: 50, sort: "order,-createdAt", overrideAccess: true, where: { member: { equals: memberId } } });
  return result.docs.map((doc) => map(doc as unknown as PortfolioDoc));
}

export async function getPublicProfile(handle: string) {
  const payload = await getPayloadClient();
  const members = await payload.find({ collection: "members", depth: 1, limit: 1, overrideAccess: true, where: { and: [{ handle: { equals: handle } }, { visibility: { equals: "public" } }] } });
  const member = members.docs[0];
  if (!member) notFound();
  const result = await payload.find({ collection: "portfolios", depth: 1, limit: 50, sort: "order,-createdAt", overrideAccess: true, where: { and: [{ member: { equals: member.id } }, { status: { equals: "published" } }, { visibility: { equals: "public" } }] } });
  const avatar = typeof member.avatar === "object" && member.avatar ? member.avatar : null;
  return {
    member: { name: member.name, handle: member.handle || handle, headline: member.headline || "", bio: member.bio || "", location: member.location || "", linkedin: member.linkedin || "", portfolioUrl: member.portfolioUrl || "", avatarUrl: avatar?.url || "" },
    portfolios: result.docs.map((doc) => map(doc as unknown as PortfolioDoc)),
  };
}