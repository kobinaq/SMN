/**
 * Standard CTA terminology for the marketing site.
 * Paths follow the Website Structure doc (Learn / Grow / Connect).
 *
 * Hire / jobs / intern public entry points stay retired; their hrefs point at
 * /connect so dormant code does not deep-link into removed boards.
 */
export const cta = {
  /** Primary member conversion — cohort application */
  applyCohort: {
    label: "Apply for the next cohort",
    shortLabel: "Apply now",
    href: "/apply",
  },
  /** Header account creation — secondary to Apply */
  joinTsa: {
    label: "Join TSA",
    shortLabel: "Join TSA",
    href: "/signup",
  },
  explorePrograms: {
    label: "Explore our programmes",
    href: "/learn",
  },
  exploreServices: {
    label: "Explore our programmes",
    href: "/learn",
  },
  viewCohort: {
    label: "Programme details",
    href: "/learn/social-media-marketing-ai-programme",
  },
  viewCurriculum: {
    label: "View the curriculum",
    href: "/learn/social-media-marketing-ai-programme#curriculum",
  },
  viewCourses: {
    label: "Explore courses",
    href: "/learn/courses",
  },
  viewExperience: {
    label: "Learn about practical work",
    href: "/learn#practical-work",
  },
  joinCommunity: {
    label: "Join the community",
    href: "/connect",
  },
  viewMentors: {
    label: "Mentors",
    href: "/connect/mentors",
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
    href: "/connect",
  },
  requestIntern: {
    label: "Request a TSA intern",
    href: "/connect",
  },
  postJob: {
    label: "Post a job",
    href: "/connect",
  },
  shareOpportunity: {
    label: "Share an opportunity",
    href: "/connect",
  },
  partner: {
    label: "Partner With Us",
    href: "/partner",
  },
  browseJobs: {
    label: "Browse job opportunities",
    href: "/connect",
  },
  browseInternships: {
    label: "Browse internships",
    href: "/connect",
  },
  contact: {
    label: "Contact TSA",
    href: "/contact",
  },
  whatsapp: {
    label: "Chat on WhatsApp",
    communityLabel: "Also get TSA updates on WhatsApp",
    updatesLabel: "Get TSA updates on WhatsApp",
  },
  submitApplication: {
    label: "Submit application",
  },
} as const;
