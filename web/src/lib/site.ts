import { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL } from "@/lib/currency";
import { agencyEnabled } from "@/lib/features";

/**
 * Fallback site configuration.
 * Live values should come from Payload `site-settings` via `getSiteSettings()`.
 * Pricing defaults intentionally withhold unconfirmed figures.
 */
/** Trim whitespace and a trailing slash so generated URLs stay valid. */
export function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export const site = {
  name: "Think Social Academy",
  shortName: "TSA",
  tagline: "Build social media marketing skills that make you opportunity-ready.",
  description:
    "Build practical social media marketing skills with Think Social Academy. Explore professional training, specialised learning and organisational programs.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "https://thinksocialacademy.com"),
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
    headline: "Build social media marketing skills that make you opportunity-ready.",
    supportingCopy:
      "Learn social media marketing skills, execute smarter and grow any brand or business. Whether you are starting out, strengthening your professional skills or developing your team's capabilities, TSA offers practical learning grounded in strategy, application and the realities of the industry.",
    primaryCtaLabel: "Explore our programs",
    primaryCtaHref: "/programs",
    secondaryCtaLabel: "Discover TSA",
    secondaryCtaHref: "/about",
  },
  announcementBanner: "",
  footerBlurb:
    "Think Social Academy equips individuals, business owners and organisations with practical social media marketing skills, strategic thinking and tools for today's digital landscape.",
  impactStats: [] as { label: string; value: string }[],
  cohort: {
    name: "Social Media Marketing & AI Program",
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

export type NavItem = {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
};

/**
 * Primary navigation. Labels match the website document.
 * Agency is appended only when NEXT_PUBLIC_AGENCY_ENABLED=true.
 * Member sign in stays a header action, not a nav item.
 */
const baseNav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Resources", href: "/resources" },
  { label: "Partnerships", href: "/partnerships" },
];

export const nav: readonly NavItem[] = agencyEnabled
  ? [...baseNav, { label: "Agency", href: "/agency" }]
  : baseNav;

/** Re-export pending labels for seed content */
export { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL };
