/**
 * Shared checks for public page copy modules (rebuild tickets T8 to T10).
 * Tab 5 rules: no em dashes, no old SMN name, no hire / intern / job or
 * placement promises, no guaranteed outcomes.
 */

export const bannedCopyPatterns: Array<[string, RegExp]> = [
  ["em dash", /\u2014|&mdash;/],
  ["SMN name", /\bSMN\b|Social Marketers/i],
  ["hire copy", /\bhir(e|ing)\b/i],
  ["intern copy", /\bintern(s|ship|ships)?\b/i],
  ["job copy", /\bjobs?\b|placement/i],
  ["guarantee", /guarantee/i],
];

/** Every string value inside a copy module, however deeply nested. */
export function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

/** Returns "rule: text" for each string that breaks a copy rule. */
export function findCopyViolations(module: Record<string, unknown>): string[] {
  const problems: string[] = [];
  for (const text of collectStrings(module)) {
    for (const [rule, pattern] of bannedCopyPatterns) {
      if (pattern.test(text)) problems.push(`${rule}: ${text}`);
    }
  }
  return problems;
}
