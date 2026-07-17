/**
 * Standard public currency format for SMN: GH₵2,500
 * Do not invent amounts — only format confirmed values from CMS/settings.
 */
export function formatGhs(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  return `GH₵${Math.round(amount).toLocaleString("en-GH")}`;
}

/** Normalise legacy "GHS 2,500" / "GH₵2500" strings when a numeric parse is possible. */
export function formatGhsLabel(raw: string | null | undefined): string {
  const value = (raw || "").trim();
  if (!value) return "";
  if (/contact smn|see selar|pending|confirm/i.test(value)) return value;

  const numeric = value.replace(/[^\d.]/g, "");
  if (!numeric) return value;
  const amount = Number(numeric);
  if (!Number.isFinite(amount) || amount <= 0) return value;
  return formatGhs(amount);
}

export const FEE_PENDING_LABEL = "Contact SMN for current fees";
export const COURSE_FEE_PENDING_LABEL = "Price on checkout";
