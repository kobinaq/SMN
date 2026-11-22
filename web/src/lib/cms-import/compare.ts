/**
 * Compare stored CMS data with import data. System fields (ids, timestamps,
 * status) and empty values are ignored, key order does not matter.
 */

const IGNORED_KEYS = new Set(["id", "createdAt", "updatedAt", "_status", "blockName", "globalType", "_id", "__v"]);

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
}

export function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize).filter((item) => !isEmpty(item));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as object).sort()) {
      if (IGNORED_KEYS.has(key)) continue;
      const next = normalize((value as Record<string, unknown>)[key]);
      if (!isEmpty(next)) out[key] = next;
    }
    return out;
  }
  return value;
}

export function sameContent(a: unknown, b: unknown): boolean {
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

type Doc = Record<string, unknown> | null | undefined;

const pick = (doc: Doc, keys: readonly string[]) => Object.fromEntries(keys.map((key) => [key, doc?.[key]]));

export const PAGE_FIELDS = ["title", "slug", "layout", "meta"] as const;
export const HEADER_FIELDS = ["navItems", "ctaButton", "sections"] as const;
export const FOOTER_FIELDS = ["blurb", "columns", "legalLinks", "socialLinks"] as const;

export const pageComparable = (doc: Doc) => normalize(pick(doc, PAGE_FIELDS));
export const headerComparable = (doc: Doc) => normalize(pick(doc, HEADER_FIELDS));
export const footerComparable = (doc: Doc) => normalize(pick(doc, FOOTER_FIELDS));

/** A never-saved global comes back with only defaults: no nav, links, columns or blurb. */
export function isBlankGlobal(doc: Doc, contentFields: readonly string[]): boolean {
  const fields = contentFields.filter((key) => key !== "sections");
  return Object.keys(normalize(pick(doc, fields)) as object).length === 0;
}
