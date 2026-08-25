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
    label: "Explore the Academy",
    href: "/programs",
  },
  exploreServices: {
    label: "Explore our Services",
    href: "/programs",
  },
  viewCohort: {
    label: "View the curriculum",
    href: "/programs/cohort",
  },
  viewCurriculum: {
    label: "View the curriculum",
    href: "/programs/cohort#curriculum",
  },
  viewCourses: {
    label: "Explore courses",
    href: "/programs/courses",
  },
  viewExperience: {
    label: "Learn about the Experience Programme",
    href: "/experience",
  },
  joinCommunity: {
    label: "Join the community",
    href: "/community",
  },
  /** On-platform Paystack purchase */
  buyCourse: {
    label: "Enroll now",
  },
  memberSignIn: {
    label: "Member sign in",
    href: "/login",
  },
  memberSignUp: {
    label: "Create member account",
    href: "/signup",
  },
  hireTalent: {
    label: "Hire SMN talent",
    href: "/employers",
  },
  requestIntern: {
    label: "Request an intern",
    href: "/employers/request-intern",
  },
  postJob: {
    label: "Post a job",
    href: "/employers/post-a-job",
  },
  shareOpportunity: {
    label: "Share an opportunity",
    href: "/employers/post-a-job",
  },
  partner: {
    label: "Partner with us",
    href: "/employers",
  },
  browseJobs: {
    label: "Browse job opportunities",
    href: "/careers/jobs",
  },
  browseInternships: {
    label: "Browse internships",
    href: "/careers/internships",
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
