/** Toggle-able sections. Links under these paths are hidden when the toggle is off. */
export type SectionToggles = { showAgency?: boolean | null; showEvents?: boolean | null };

const sectionPaths = [
  { key: "showAgency", prefix: "/agency" },
  { key: "showEvents", prefix: "/events" },
] as const;

function underPrefix(href: string, prefix: string): boolean {
  if (!href.startsWith(prefix)) return false;
  const next = href.charAt(prefix.length);
  return next === "" || next === "/" || next === "?" || next === "#";
}

/** True when the href points at a section whose toggle is off. */
export function isHiddenBySections(href: string, sections: SectionToggles | null | undefined): boolean {
  const path = href.trim();
  return sectionPaths.some(({ key, prefix }) => !sections?.[key] && underPrefix(path, prefix));
}

/** Drops items whose href points at a hidden section. Order is kept. */
export function filterBySections<T extends { href?: string | null }>(
  items: readonly T[] | null | undefined,
  sections: SectionToggles | null | undefined,
): T[] {
  return (items ?? []).filter((item) => !item.href || !isHiddenBySections(item.href, sections));
}
