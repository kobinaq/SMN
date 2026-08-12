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
    headline: "Learn marketing that gets results.",
    supportingCopy: "Strategy, mentorship, and portfolio-ready work, with a network that keeps you growing.",
    primaryCtaLabel: "Apply for the next cohort",
    secondaryCtaLabel: "Explore the Academy",
    secondaryCtaHref: "/programs",
  },
  announcementBanner: "",
  footerBlurb:
    "Member portal with courses, progress tracking, mentorship, opportunities, portfolios, and verifiable credentials. Community on WhatsApp. Catalogue courses enroll on-platform.",
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
    priceNote: "Payment is requested after acceptance. Payment plans may be available.",
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
    label: "Academy",
    href: "/programs",
    children: [
      { label: "Training Programs", href: "/programs" },
      { label: "Self-Paced Courses", href: "/programs/courses" },
      { label: "Simulations", href: "/simulations" },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Job opportunities", href: "/careers/jobs" },
      { label: "Internships", href: "/careers/internships" },
      { label: "Mentorship", href: "/mentorship" },
    ],
  },
  {
    label: "Employers",
    href: "/employers",
    children: [
      { label: "Hire Talent", href: "/employers" },
      { label: "Request an Intern", href: "/employers/request-intern" },
      { label: "Post a Job", href: "/employers/post-a-job" },
    ],
  },
  {
    label: "Community",
    href: "/community",
    children: [
      { label: "WhatsApp Community", href: "/community" },
      { label: "Events/Webinar", href: "/events" },
      { label: "Member Stories", href: "/stories" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Insights", href: "/insights" },
      { label: "Free Resources", href: "/resources" },
      { label: "Templates", href: "/resources/templates" },
      { label: "Guides", href: "/resources/guides" },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
] as const;

/** Re-export pending labels for seed content */
export { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL };
