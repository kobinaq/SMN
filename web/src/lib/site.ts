import { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL } from "@/lib/currency";

/**
 * Fallback site configuration.
 * Live values should come from Payload `site-settings` via `getSiteSettings()`.
 * Pricing defaults intentionally withhold unconfirmed figures.
 */
export const site = {
  name: "Social Marketers Network",
  shortName: "SMN",
  tagline: "We develop marketers, not just content creators.",
  description:
    "A professional learning network for modern marketers: practical skills, mentorship, portfolios, credentials, and career opportunities — with a native member platform.",
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
    headline: "Learn marketing that gets results. Build proof. Join the network.",
    supportingCopy:
      "SMN helps beginners, social media managers, and marketers develop strategy, research, brand, campaigns, analytics, and portfolio-ready work — then connects them to mentors, community, and opportunities.",
    primaryCtaLabel: "Apply for the next cohort",
    secondaryCtaLabel: "Explore programmes",
    secondaryCtaHref: "/programs",
  },
  announcementBanner: "",
  footerBlurb:
    "Member portal with courses, progress tracking, mentorship, opportunities, portfolios, and verifiable credentials. Community on WhatsApp. Selected courses also available on Selar.",
  cohort: {
    name: "Social Media Marketing & AI Cohort",
    startDate: "September 2026",
    applicationDeadline: "Rolling — apply early",
    duration: "8 weeks",
    seats: 30,
    format: "Live classes, member platform, WhatsApp community, and portfolio projects",
    sessions: "2 live sessions per week (Classroom) plus member-platform learning",
    /** Safe public wording until the client confirms a final fee */
    priceLabel: FEE_PENDING_LABEL,
    priceNote:
      "Payment is requested after acceptance. Payment plans may be available. Fee amount requires client confirmation before public display.",
    priceConfirmed: false,
    audience: "Beginners, social media managers, freelancers, and marketers ready for strategy-level work",
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

export const nav = [
  {
    label: "Programmes",
    href: "/programs",
    children: [
      { label: "All programmes", href: "/programs" },
      { label: "Flagship cohort", href: "/programs/cohort" },
      { label: "Self-paced courses", href: "/programs/courses" },
    ],
  },
  {
    label: "Learning",
    href: "/resources",
    children: [
      { label: "Free resources", href: "/resources" },
      { label: "Insights", href: "/insights" },
      { label: "Mentorship", href: "/mentorship" },
    ],
  },
  {
    label: "Community",
    href: "/community",
    children: [
      { label: "WhatsApp community", href: "/community" },
      { label: "Events", href: "/events" },
      { label: "Member stories", href: "/stories" },
    ],
  },
  { label: "Employers", href: "/employers" },
  { label: "About", href: "/about" },
] as const;

/** Re-export pending labels for seed content */
export { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL };
