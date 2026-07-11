import type { MemberUser } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";

type Relation<T> = T | string | number | null | undefined;
type MediaDoc = { url?: string | null; filename?: string | null };
type MemberDoc = { id: string | number; name?: string | null; email?: string | null; handle?: string | null };
type CertificateDoc = {
  id: string | number;
  title: string;
  programName: string;
  programKey?: string | null;
  credentialCode: string;
  summary?: string | null;
  skills?: { skill?: string | null }[] | null;
  pdf?: Relation<MediaDoc>;
  member?: Relation<MemberDoc>;
  issuedAt?: string | null;
  expiresAt?: string | null;
  status: "draft" | "valid" | "revoked";
  visibility: "private" | "public";
};

export type CertificateCard = {
  id: string | number;
  title: string;
  programName: string;
  credentialCode: string;
  summary: string;
  skills: string[];
  pdfUrl: string;
  issuedAt: string;
  expiresAt: string;
  status: "draft" | "valid" | "revoked";
  verifyUrl: string;
};

export type VerifiedCertificate = CertificateCard & {
  memberName: string;
  memberHandle: string;
};

function getMediaUrl(media: CertificateDoc["pdf"]) {
  return typeof media === "object" && media ? media.url || "" : "";
}

function getMemberName(member: CertificateDoc["member"]) {
  if (typeof member !== "object" || !member) return "SMN member";
  return member.name?.trim() || member.email?.split("@")[0] || "SMN member";
}

function getMemberHandle(member: CertificateDoc["member"]) {
  return typeof member === "object" && member?.handle ? member.handle : "";
}

function toCertificateCard(doc: CertificateDoc): CertificateCard {
  const code = doc.credentialCode.trim();
  return {
    id: doc.id,
    title: doc.title,
    programName: doc.programName,
    credentialCode: code,
    summary: doc.summary || "",
    skills: (doc.skills || []).map((item) => item.skill?.trim()).filter(Boolean) as string[],
    pdfUrl: getMediaUrl(doc.pdf),
    issuedAt: doc.issuedAt || "",
    expiresAt: doc.expiresAt || "",
    status: doc.status,
    verifyUrl: `/verify/${encodeURIComponent(code)}`,
  };
}

export async function getMemberCertificates(member: MemberUser) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "certificates",
    depth: 2,
    limit: 100,
    sort: "-issuedAt",
    overrideAccess: true,
    where: { member: { equals: member.id } },
  });

  return result.docs.map((doc) => toCertificateCard(doc as CertificateDoc));
}

export async function getVerifiedCertificate(code: string): Promise<VerifiedCertificate | null> {
  const cleaned = code.trim();
  if (!cleaned) return null;

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "certificates",
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { credentialCode: { equals: cleaned } },
        { status: { equals: "valid" } },
        { visibility: { equals: "public" } },
      ],
    },
  });
  const doc = result.docs[0] as CertificateDoc | undefined;
  if (!doc) return null;

  return {
    ...toCertificateCard(doc),
    memberName: getMemberName(doc.member),
    memberHandle: getMemberHandle(doc.member),
  };
}
