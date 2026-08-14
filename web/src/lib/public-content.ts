import { instructor } from "@/lib/content";
import { FEE_PENDING_LABEL, formatGhsLabel } from "@/lib/currency";
import { lexicalToParagraphs } from "@/lib/lexical-text";
import type { SiteConfig } from "@/lib/site";

/** Seed lists only when USE_SEED_CONTENT (or equivalent) is on. Empty CMS stays empty. */
export function publicList<T>(args: {
  useSeed: boolean;
  seed: T[];
  docs: T[];
  cmsFailed?: boolean;
  failClosed?: boolean;
}): T[] {
  if (args.useSeed) return args.seed;
  if (args.cmsFailed) return args.failClosed ? [] : args.seed;
  return args.docs;
}

export function resolveCohortPrice(raw: string | null | undefined, confirmed: boolean): string {
  if (!confirmed) return FEE_PENDING_LABEL;
  return formatGhsLabel(raw) || FEE_PENDING_LABEL;
}

export type PublicCohort = SiteConfig["cohort"] & {
  id: string | number;
  slug: string;
  featured: boolean;
  enrollmentOpen: boolean;
};

export type LmsCohortSource = {
  id: string | number;
  title?: string | null;
  slug?: string | null;
  startDate?: string | null;
  applicationDeadline?: string | null;
  duration?: string | null;
  seats?: number | null;
  audience?: string | null;
  format?: string | null;
  sessions?: string | null;
  priceLabel?: string | null;
  priceNote?: string | null;
  priceConfirmed?: boolean | null;
  featured?: boolean | null;
  enrollmentOpen?: boolean | null;
};

function presentText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function cohortFromLmsDoc(doc: LmsCohortSource, fallback: SiteConfig["cohort"]): PublicCohort {
  const confirmed = Boolean(doc.priceConfirmed);
  return {
    id: doc.id,
    slug: presentText(doc.slug, ""),
    featured: Boolean(doc.featured),
    enrollmentOpen: doc.enrollmentOpen !== false,
    name: presentText(doc.title, fallback.name),
    startDate: presentText(doc.startDate, fallback.startDate),
    applicationDeadline: presentText(doc.applicationDeadline, fallback.applicationDeadline),
    duration: presentText(doc.duration, fallback.duration),
    seats: typeof doc.seats === "number" && doc.seats > 0 ? doc.seats : fallback.seats,
    audience: presentText(doc.audience, fallback.audience),
    format: presentText(doc.format, fallback.format),
    sessions: presentText(doc.sessions, fallback.sessions),
    priceConfirmed: confirmed,
    priceLabel: resolveCohortPrice(doc.priceLabel, confirmed),
    priceNote: presentText(doc.priceNote, fallback.priceNote),
  };
}

export function pickFeaturedCohort(docs: PublicCohort[]): PublicCohort | undefined {
  return docs.find((item) => item.featured) ?? docs[0];
}

export function blogBodyFromCms(content: unknown, excerpt: string): string[] {
  const paragraphs = lexicalToParagraphs(content);
  if (paragraphs.length) return paragraphs;
  return excerpt.trim() ? [excerpt.trim()] : [];
}

export function blogAuthorDefaults() {
  return {
    author: instructor.name,
    authorRole: instructor.role,
    authorImage: instructor.image,
  };
}
