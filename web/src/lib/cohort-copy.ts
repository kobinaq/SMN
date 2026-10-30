/**
 * Sentence helpers for cohort facts that are interpolated mid-sentence on the
 * home page. The raw values (site defaults or CMS) are written as standalone
 * labels, e.g. "Aspiring social media managers, ..." or "Rolling. Apply early",
 * so they need small adjustments to read naturally inside a sentence.
 */

/** "For aspiring social media managers, ..." (lowercases a leading capital, keeps acronyms like TSA). */
export function cohortAudienceSentence(audience: string): string {
  const text = audience.trim().replace(/[.\s]+$/, "");
  if (!text) return "";
  const lowered = /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
  return `For ${lowered}.`;
}

/**
 * "Applications are rolling. Apply early." for a rolling deadline, otherwise
 * "Apply by <deadline>." for a real date.
 */
export function cohortDeadlineSentence(deadline: string | null | undefined): string {
  const text = (deadline ?? "").trim().replace(/[.\s]+$/, "");
  if (!text || /^rolling\b/i.test(text)) return "Applications are rolling. Apply early.";
  return `Apply by ${text}.`;
}

/** Shown wherever a start date would go while the next cohort has no confirmed date. */
export const COHORT_DATES_PENDING = "Next cohort dates coming soon";

/** The start date for labels, tiles and meta lines, or neutral copy when unknown. */
export function cohortStartLabel(startDate: string | null | undefined): string {
  const text = (startDate ?? "").trim();
  return text || COHORT_DATES_PENDING;
}

/** "Next intake <date>." for a known date, otherwise "Next cohort dates coming soon." */
export function cohortStartSentence(startDate: string | null | undefined): string {
  const text = (startDate ?? "").trim().replace(/[.\s]+$/, "");
  return text ? `Next intake ${text}.` : `${COHORT_DATES_PENDING}.`;
}
