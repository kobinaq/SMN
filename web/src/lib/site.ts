import { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL } from "@/lib/currency";

/**
 * Fallback site configuration.
 * Live values should come from Payload `site-settings` via `getSiteSettings()`.
 * Pricing defaults intentionally withhold unconfirmed figures.
 */
export const site = {
  name: "Social Marketers Network",
  shortName: "SMN",
  tagline: "Learn Social Media Marketing. Lead with AI. Gain Real-World Experience. Grow with Community.",
  description:
    "A professional learning network where beginners, early-career, and marketing professionals build the skills, experience, and network they need to thrive in a rapidly changing digital industry.",
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
    headline: "Learn Social Media Marketing. Lead with AI. Gain Real-World Experience. Grow with Community.",
    supportingCopy:
      "Social Marketers Network is a professional learning network where beginners, early-career and marketing professionals build the skills, experience and network they need to thrive in a rapidly changing digital industry.",
    primaryCtaLabel: "Explore our Services",
    secondaryCtaLabel: "Join the Community",
    secondaryCtaHref: "/community",
  },
  announcementBanner: "",
  footerBlurb:
    "Learn, practise, connect, and grow in one ecosystem. Member portal for courses, mentorship, opportunities, portfolios, and credentials. Community on WhatsApp.",
  impactStats: [] as { label: string; value: string }[],
  cohort: {
    name: "Social Media Marketing & AI Cohort",
    startDate: "September 2026",
    applicationDeadline: "Rolling. Apply early",
    duration: "8 weeks",
    seats: 30,
    format: "Live classes, member platform, WhatsApp community, and portfolio projects",
    sessions: "2 live sessions per week (Classroom) plus member-platform learning",
    /** Safe public wording until the client confirms a final fee */
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

export const nav = [
  {
    label: "Academy",
    href: "/programs",
    children: [
      { label: "Training", href: "/programs/cohort" },
      { label: "Courses", href: "/programs/courses" },
      { label: "Simulations", href: "/simulations" },
      { label: "Experience", href: "/experience" },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Jobs", href: "/careers/jobs" },
      { label: "Internships", href: "/careers/internships" },
      { label: "Mentorship", href: "/mentorship" },
    ],
  },
  {
    label: "Partners",
    href: "/employers",
    children: [
      { label: "Partner with us", href: "/employers" },
      { label: "Request intern", href: "/employers/request-intern" },
      { label: "Post a job", href: "/employers/post-a-job" },
    ],
  },
  {
    label: "Community",
    href: "/community",
    children: [
      { label: "Network", href: "/community" },
      { label: "Events", href: "/events" },
      { label: "Member stories", href: "/stories" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Insights", href: "/insights" },
      { label: "Free resources", href: "/resources" },
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
