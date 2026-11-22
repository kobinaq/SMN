/** Select options shared by Payload collections and the staff forms. */

/**
 * Category option values are stored in the database and become GraphQL enum keys,
 * so they must be GraphQL-safe (no "&"). The visible label can differ from the value.
 */
export const CONTENT_MARKETING_VALUE = "Content Marketing and Planning";
export const CONTENT_MARKETING_LABEL = "Content Marketing & Planning";
/** Value stored before the GraphQL-safe rename. Still mapped to the same label. */
export const LEGACY_CONTENT_MARKETING_VALUE = "Content Marketing & Planning";

const categoryLabels: Record<string, string> = {
  [CONTENT_MARKETING_VALUE]: CONTENT_MARKETING_LABEL,
  [LEGACY_CONTENT_MARKETING_VALUE]: CONTENT_MARKETING_LABEL,
};

/** Visible label for a stored category value. Unknown values are returned unchanged. */
export function categoryLabel(value: string): string {
  return categoryLabels[value] ?? value;
}

/** Stored value for a category (maps the legacy "&" value to the current one). */
export function categoryValue(value: string): string {
  return value === LEGACY_CONTENT_MARKETING_VALUE ? CONTENT_MARKETING_VALUE : value;
}

export const postCategories = [
  "Marketing Strategy",
  "AI",
  "Social Media",
  "Career Development",
  "Case Studies",
  "Industry Trends",
  "Community Stories",
  "Social Media Strategy",
  CONTENT_MARKETING_VALUE,
  "Platforms",
  "Performance",
  "Professional Development",
] as const;

export const postStatuses = ["draft", "published"] as const;

export const resourceCategories = [
  "Social Media Strategy",
  CONTENT_MARKETING_VALUE,
  "AI",
  "Platforms",
  "Performance",
  "Professional Development",
] as const;

export const resourceFormats = [
  "Template",
  "Checklist",
  "Worksheet",
  "Planning tool",
  "Guide",
  "Prompt library",
  "Handbook",
  "Toolkit",
  "Download",
  "Link",
] as const;

/** Select options as {label, value}. Category values get their visible label. */
export function selectOptions(values: readonly string[]) {
  return values.map((value) => ({ label: categoryLabel(value), value }));
}
