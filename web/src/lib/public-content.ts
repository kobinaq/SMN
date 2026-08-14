import { instructor } from "@/lib/content";
import { FEE_PENDING_LABEL, formatGhsLabel } from "@/lib/currency";
import { lexicalToParagraphs } from "@/lib/lexical-text";

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
