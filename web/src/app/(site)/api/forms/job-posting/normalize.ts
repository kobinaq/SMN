/** Pure helpers for the job-posting intake, kept free of Payload imports so
 *  they can be unit-tested without booting the CMS. */

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Turn an employer's "how to apply" answer into a usable link, or null. */
export function normalizeApplyTarget(value: string): string | null {
  const trimmed = value.trim();
  if (EMAIL_RE.test(trimmed)) return `mailto:${trimmed.toLowerCase()}`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Bare domain like "careers.acme.com/role" — assume https.
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(trimmed)) return `https://${trimmed}`;
  return null;
}
