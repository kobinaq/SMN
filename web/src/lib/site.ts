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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thinksocialacademy.com",
  // Contact and social fallbacks stay empty so a missing CMS row does not resurrect
  // retired SMN addresses. Live values come from site-settings / env.
  email: process.env.OPS_EMAIL ?? "",
  whatsappInvite: process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? "",
  social: {
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  homepage: {
    // Website Structure doc hero. Admin site-settings is the source of truth when set.
    headline: "Learn the skills to deliver results for any brand or business using social media.",
    supportingCopy:
      "Learn social media marketing, execute smarter and leave with real experience to become opportunity-ready. Whether you are starting out, building on existing experience, or developing your team's capabilities, TSA gives you a structured, practical training in one of the most in-demand areas of digital skills.",
    primaryCtaLabel: "Explore our programmes",
    primaryCtaHref: "/learn",
    // Cohort number/date unconfirmed in the doc — keep generic apply wording.
    secondaryCtaLabel: "Apply for the next cohort",
    secondaryCtaHref: "/apply",
  },
  announcementBanner: "",
  footerBlurb:
    "Think Social Academy - a social media marketing academy teaching strategy, content, AI tools, and practical application.",
  impactStats: [] as { label: string; value: string }[],
  cohort: {
    name: "Social Media Marketing & AI Programme",
    // Empty means unknown. Display through cohort-copy helpers.
    startDate: "",
    applicationDeadline: "Rolling. Apply early",
    duration: "4 weeks",
    seats: 30,
    format: "Online · Cohort-based",
    sessions: "Structured sessions plus practical assignments",
    priceLabel: FEE_PENDING_LABEL,
    priceNote: "Payment is requested after acceptance. Payment plans may be available.",
    priceConfirmed: false,
    audience:
      "People starting out in social media marketing, social media managers who want to upskill or learn to execute with AI, and those who want a structured, guided learning experience with tutor support",
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
    primaryCtaHref: string;
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
 * Public marketing navigation from the Website Structure doc.
 * Header primary CTA is Apply (see Header), not a nav item.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "/learn" },
  { label: "Grow", href: "/grow" },
  {
    label: "Connect",
    href: "/connect",
    children: [
      { label: "Community", href: "/connect" },
      { label: "Mentors", href: "/connect/mentors" },
      { label: "Events", href: "/events" },
    ],
  },
  { label: "Partner With Us", href: "/partner" },
  { label: "About", href: "/about" },
] as const;

/** Re-export pending labels for seed content */
export { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL };
