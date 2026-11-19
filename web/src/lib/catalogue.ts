/** Select options shared by Payload collections and the staff forms. */

export const postCategories = [
  "Marketing Strategy",
  "AI",
  "Social Media",
  "Career Development",
  "Case Studies",
  "Industry Trends",
  "Community Stories",
  "Social Media Strategy",
  "Content Marketing & Planning",
  "Platforms",
  "Performance",
  "Professional Development",
] as const;

export const postStatuses = ["draft", "published"] as const;

export const resourceCategories = [
  "Social Media Strategy",
  "Content Marketing & Planning",
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

export function selectOptions(values: readonly string[]) {
  return values.map((value) => ({ label: value, value }));
}
