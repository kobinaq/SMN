/**
 * Resources and Insights page copy (ticket T9).
 *
 * Source: Tab 4 "05 Resources", adjusted to the Tab 5 brand rules where they
 * conflict (Tab 5 wins). Categories map onto what already exists: the CMS
 * resource library (/resources?type=...), Insights articles (/insights) and
 * events (/events). Nothing is invented: empty sections keep their existing
 * empty states.
 */

export const resourcesHero = {
  kicker: "Resources",
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
    href: "/resources?type=Guide",
  },
  {
    title: "Templates",
    body: "Ready-to-use files for planning, content and campaign work.",
    href: "/resources?type=Template",
  },
  {
    title: "Tools",
    body: "Toolkits, checklists and AI prompts to support your workflow.",
    href: "/resources?type=Toolkit",
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
    // TODO(placeholder): the member portal has no member-only resource library yet.
    // Copy says "as they are published" until one exists.
    body: "Available through the TSA member portal as they are published, alongside your programme materials.",
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
  { label: "Explore the Academy", href: "/academy" },
  { label: "Free resources", href: "/resources" },
  { label: "Join the Community", href: "/signup" },
] as const;

export const insightsNewsletter = {
  title: "Get strategy notes in your inbox",
  body: "Practical ideas on social media marketing, strategy and AI. No spam, just useful posts from TSA.",
} as const;
