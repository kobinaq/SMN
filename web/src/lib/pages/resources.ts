/**
 * Resources and Insights page copy (ticket T9).
 *
 * Source: Tab 4 "05 Resources", adjusted to the Tab 5 brand rules where they
 * conflict (Tab 5 wins). Categories map onto what already exists: the CMS
 * resource library (/grow?type=...), Insights articles (/insights) and
 * events (/events). Nothing is invented: empty sections keep their existing
 * empty states.
 */

export const resourcesHero = {
  kicker: "Grow",
  title: "Keep learning.",
  lede: "Practical resources to help you think, create and work better in social media marketing.",
} as const;

export type ResourceCategory = { title: string; body: string; href: string };

/** Tab 4 categories, each pointed at the place that content is published. */
export const resourceCategories: ResourceCategory[] = [
  {
    title: "Articles",
    body: "Ideas and practical thinking on social media marketing, strategy and AI.",
    href: "/insights",
  },
  {
    title: "Guides",
    body: "Step-by-step guides for clearer, more purposeful marketing work.",
    href: "/grow?type=Guide",
  },
  {
    title: "Templates",
    body: "Ready-to-use files for planning, content and campaign work.",
    href: "/grow?type=Template",
  },
  {
    title: "Tools",
    body: "Toolkits, checklists and AI prompts to support your workflow.",
    href: "/grow?type=Toolkit",
  },
  {
    title: "Case Studies",
    body: "How marketing challenges were approached, what was decided and what was learned.",
    href: "/insights?category=Case%20Studies",
  },
  {
    title: "Webinars & Insights",
    body: "TSA webinars, events and industry conversations as they are scheduled.",
    href: "/events",
  },
];

/** Tab 4 "Public Resources" and "Member Resources". */
export const resourceAccess = {
  public: {
    title: "Public resources",
    body: "Available to everyone. Open a resource, enter your email, and we send the file.",
    href: "#library",
    ctaLabel: "Browse the library",
  },
  member: {
    title: "Member resources",
    // TODO(placeholder): a members-only resource library does not exist yet. When one is
    // built, extend this card. Today it only describes programme materials in the account.
    body: "Enrolled learners find their programme materials and resources inside their TSA account.",
    href: "/signup",
    ctaLabel: "Join TSA",
    secondaryHref: "/login",
    secondaryLabel: "Member sign in",
  },
} as const;

/** "What is in here" list for the library aside. Replaces brand.ts resourceOfferings ("Career resources" dropped). */
export const resourceLibraryContents = [
  "Content calendars",
  "Marketing templates",
  "Strategy frameworks",
  "Checklists",
  "AI prompts",
  "Guides",
  "Worksheets",
] as const;

export const insightsHero = {
  kicker: "Insights",
  title: "Ideas for thinking beyond posting.",
  lede: "Articles, case studies and perspectives on social media marketing, strategy and AI from Think Social Academy.",
} as const;

export const insightsLinks = [
  { label: "Explore our programmes", href: "/learn" },
  { label: "Free resources", href: "/grow" },
  { label: "Join the community", href: "/connect" },
] as const;

export const insightsNewsletter = {
  title: "Get strategy notes in your inbox",
  body: "Practical ideas on social media marketing, strategy and AI. No spam, just useful posts from TSA.",
} as const;
