export const previewBreakpoints = [
  { label: "Phone", name: "phone", width: 390, height: 844 },
  { label: "Desktop", name: "desktop", width: 1440, height: 900 },
];

/** Preview URL for a page slug. Relative when NEXT_PUBLIC_SITE_URL is unset. Read at call time. */
export function pagePreviewUrl(slug: string | null | undefined, env: Record<string, string | undefined> = process.env): string {
  const base = (env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");
  return `${base}/preview/pages/${encodeURIComponent(slug || "home")}`;
}
