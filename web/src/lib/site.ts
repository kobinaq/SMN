import { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL } from "@/lib/currency";

/**
 * Fallback site configuration.
 * Live values should come from Payload `site-settings` via `getSiteSettings()`.
 * Pricing defaults intentionally withhold unconfirmed figures.
 */
export const site = {
  name: "Think Social Academy",
  shortName: "TSA",
  tagline: "Learn. Apply. Grow. Connect.",
  description:
    "Think Social Academy is a social media marketing academy and community focused on thoughtful learning, practical application, and work designed to support brand and business results.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://socialmarketers.network",
  email: process.env.OPS_EMAIL ?? "hello@socialmarketers.network",
  whatsappInvite:
    process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? "https://chat.whatsapp.com/socialmarketers",
  social: {
    instagram: "https://instagram.com/socialmarketersnetwork",
    linkedin: "https://linkedin.com/company/social-marketers-network",
    twitter: "https://x.com/smn_africa",
  },
  homepage: {
    // Tab 5 hero: Explore the Academy is the primary CTA, Join the Community the secondary.
    headline: "Learn social media marketing. Put it into practice. Work towards results.",
    supportingCopy:
      "Build your understanding through practical lessons, guided exercises, and simulated briefs that connect social media marketing concepts to different business contexts.",
    primaryCtaLabel: "Explore the Academy",
    secondaryCtaLabel: "Join the Community",
    // Secondary CTA target (Join the Community, a free TSA account). Explore the Academy uses cta.explorePrograms (/academy).
    secondaryCtaHref: "/signup",
  },
  announcementBanner: "",
  footerBlurb:
    "Learn, practise, connect, and grow in one ecosystem. Member portal for courses, mentorship, opportunities, portfolios, and credentials.",
  impactStats: [] as { label: string; value: string }[],
  cohort: {
    name: "Social Media Marketing & AI Cohort",
    // TODO(T5-placeholder): next cohort start date unconfirmed (September 2026 is past).
    startDate: "Next cohort dates coming soon",
    applicationDeadline: "Rolling. Apply early",
    duration: "4 weeks",
    seats: 30,
    format: "Live classes, member platform, community, and portfolio projects",
    sessions: "2 live sessions per week (Classroom) plus member-platform learning",
    /** Safe public wording until the client confirms a final fee */
    // TODO(T5-placeholder): fees unconfirmed.
    priceLabel: FEE_PENDING_LABEL,
    priceNote: "Payment is requested after acceptance. Payment plans may be available.",
    priceConfirmed: false,
    audience:
      "Aspiring social media managers, students and graduates, freelancers, creators moving into marketing, early-career marketers, and existing social media professionals",
  },
} as const;

export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  whatsappInvite: string;
  social: {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  homepage: {
    headline: string;
    supportingCopy: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  announcementBanner: string;
  footerBlurb: string;
  impactStats: { label: string; value: string }[];
  cohort: {
    name: string;
    startDate: string;
    applicationDeadline: string;
    duration: string;
    seats: number;
    format: string;
    sessions: string;
    priceLabel: string;
    priceNote: string;
    priceConfirmed: boolean;
    audience: string;
  };
};

/**
 * Primary navigation for the public marketing site.
 * Labels match Tab 4 / Tab 5 IA. Join TSA is the header CTA, not a nav item.
 * Mentors sit under Community (not a top-level item).
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Academy", href: "/academy" },
  {
    label: "Community",
    href: "/community",
    children: [
      { label: "The community", href: "/community" },
      { label: "Mentors", href: "/community/mentors" },
      { label: "Events", href: "/events" },
    ],
  },
  { label: "Partner With Us", href: "/partner" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
] as const;

/** Re-export pending labels for seed content */
export { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL };
