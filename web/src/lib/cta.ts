/**
 * Standard CTA terminology for the marketing site.
 * Use these labels so Apply / purchase / sign-in / partner / WhatsApp stay distinct.
 */
export const cta = {
  /** Primary member conversion — cohort application */
  applyCohort: {
    label: "Apply for the next cohort",
    shortLabel: "Apply now",
    href: "/apply",
  },
  /** Header primary CTA — account creation */
  joinTsa: {
    label: "Join TSA",
    shortLabel: "Join TSA",
    href: "/signup",
  },
  explorePrograms: {
    label: "Explore the Academy",
    href: "/academy",
  },
  exploreServices: {
    label: "Explore our Services",
    href: "/academy",
  },
  viewCohort: {
    label: "View the curriculum",
    href: "/academy/cohort",
  },
  viewCurriculum: {
    label: "View the curriculum",
    href: "/academy/cohort#curriculum",
  },
  viewCourses: {
    label: "Explore courses",
    href: "/academy/courses",
  },
  viewExperience: {
    label: "Learn about the Experience Programme",
    href: "/academy#practical-work",
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
    label: "Hire TSA talent",
    href: "/partner",
  },
  requestIntern: {
    label: "Request a TSA intern",
    href: "/partner?request=intern",
  },
  postJob: {
    label: "Post a job",
    href: "/partner?request=job",
  },
  shareOpportunity: {
    label: "Share an opportunity",
    href: "/partner?request=job",
  },
  partner: {
    label: "Partner with us",
    href: "/partner",
  },
  browseJobs: {
    label: "Browse job opportunities",
    href: "/community",
  },
  browseInternships: {
    label: "Browse internships",
    href: "/community",
  },
  contact: {
    label: "Contact TSA",
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
