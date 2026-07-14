/**
 * Standard CTA terminology for the marketing site.
 * Use these labels so Apply / purchase / sign-in / employer / WhatsApp stay distinct.
 */
export const cta = {
  /** Primary member conversion — cohort application */
  applyCohort: {
    label: "Apply for the next cohort",
    shortLabel: "Apply now",
    href: "/apply",
  },
  explorePrograms: {
    label: "Explore programmes",
    href: "/programs",
  },
  viewCohort: {
    label: "View cohort details",
    href: "/programs/cohort",
  },
  viewCourses: {
    label: "View courses",
    href: "/programs/courses",
  },
  /** Outbound Selar purchase — different action from applying */
  buyOnSelar: {
    label: "Buy on Selar",
  },
  memberSignIn: {
    label: "Member sign in",
    href: "/login",
  },
  hireTalent: {
    label: "Hire SMN talent",
    href: "/employers",
  },
  shareOpportunity: {
    label: "Share an opportunity",
    href: "/contact",
  },
  partner: {
    label: "Partner with SMN",
    href: "/employers",
  },
  contact: {
    label: "Contact SMN",
    href: "/contact",
  },
  whatsapp: {
    label: "Chat on WhatsApp",
    communityLabel: "Join the community",
  },
  submitApplication: {
    label: "Submit application",
  },
} as const;
