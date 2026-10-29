/**
 * Standard CTA terminology for the marketing site.
 * Use these labels so Apply / purchase / sign-in / partner / WhatsApp stay distinct.
 *
 * Hire / jobs / intern public entry points are retired (T3). Those CTA objects
 * still exist for dormant page code and portal reuse, but their hrefs point at
 * /community so nothing on the public site deep-links into the old boards.
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
    label: "Learn about practical work",
    href: "/academy#practical-work",
  },
  joinCommunity: {
    label: "Join the Community",
    href: "/signup",
  },
  viewMentors: {
    label: "Mentors",
    href: "/community/mentors",
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
  /** Retired public hire entry — kept for dormant careers/partner code */
  hireTalent: {
    label: "Hire TSA talent",
    href: "/community",
  },
  requestIntern: {
    label: "Request a TSA intern",
    href: "/community",
  },
  postJob: {
    label: "Post a job",
    href: "/community",
  },
  shareOpportunity: {
    label: "Share an opportunity",
    href: "/community",
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
    /** Secondary only. Never use as the main community CTA. */
    communityLabel: "Also get TSA updates on WhatsApp",
  },
  submitApplication: {
    label: "Submit application",
  },
} as const;
