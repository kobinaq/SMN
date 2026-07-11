export const site = {
  name: "Social Marketers Network",
  shortName: "SMN",
  tagline: "Learn social media marketing. Lead with AI. Leave with real client experience.",
  description:
    "A professional learning network for modern marketers in Africa: education, community, mentorship, and career connections.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://socialmarketers.network",
  email: process.env.OPS_EMAIL ?? "hello@socialmarketers.network",
  whatsappInvite:
    process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? "https://chat.whatsapp.com/socialmarketers",
  social: {
    instagram: "https://instagram.com/socialmarketersnetwork",
    linkedin: "https://linkedin.com/company/social-marketers-network",
    twitter: "https://x.com/smn_africa",
  },
  cohort: {
    name: "Social Media Marketing & AI Cohort",
    startDate: "September 2026",
    duration: "8 weeks",
    seats: 30,
    format: "Live classes, WhatsApp community, and portfolio projects",
    sessions: "2 live sessions per week on Google Classroom",
    priceLabel: "From GHS 250,000",
    priceNote: "Payment plans available after acceptance",
  },
} as const;

export const nav = [
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "All Programs", href: "/programs" },
      { label: "Flagship Cohort", href: "/programs/cohort" },
      { label: "Self-Paced Courses", href: "/programs/courses" },
    ],
  },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Insights", href: "/insights" },
  { label: "Resources", href: "/resources" },
  { label: "Employers", href: "/employers" },
] as const;
