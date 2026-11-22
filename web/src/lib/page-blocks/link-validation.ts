/**
 * Link rules for editor-entered hrefs: a relative path, an #anchor, mailto:,
 * tel:, or an https:// URL. Everything else (javascript:, data:, http://,
 * protocol-relative) is rejected.
 */
export function validateHref(value: string | null | undefined): true | string {
  const href = (value ?? "").trim();
  if (!href) return "Enter a link.";
  if (/[\u0000-\u001f\u007f\s]/.test(href) && !href.startsWith("mailto:")) return "Links cannot contain spaces.";
  if (href.startsWith("//")) return "Use a path starting with / or a full https:// link.";
  if (href.startsWith("/")) return true;
  if (href.startsWith("#")) return href.length > 1 || "Enter an anchor name after #.";
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(href)) return true;
  if (/^tel:\+?[0-9()\-.\s]+$/i.test(href)) return true;
  if (/^https:\/\//i.test(href)) {
    try {
      return Boolean(new URL(href).hostname) || "Enter a valid https:// link.";
    } catch {
      return "Enter a valid https:// link.";
    }
  }
  return "Use a path starting with /, #anchor, mailto:, tel:, or https://.";
}

/** Optional variant: empty is fine. */
export function validateOptionalHref(value: string | null | undefined): true | string {
  return (value ?? "").trim() ? validateHref(value) : true;
}

/** https only, for social profile links. */
export function validateHttpsUrl(value: string | null | undefined): true | string {
  const href = (value ?? "").trim();
  if (!href.toLowerCase().startsWith("https://")) return "Enter a full https:// link.";
  return validateHref(href);
}

/** Lowercase kebab-case page slug; "home" is allowed like any other. */
export function validatePageSlug(value: string | null | undefined): true | string {
  const slug = (value ?? "").trim();
  if (!slug) return "Enter a slug.";
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || "Use lowercase letters, numbers and single hyphens, like about-us.";
}
