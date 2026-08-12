/**
 * Central image map. Each path is used for one visual surface
 * so the site does not repeat the same photo across sections.
 *
 * Exception: instructor / author avatar may reuse the same portrait
 * (same person). Logos may appear in header + footer. Journey tiles
 * may reuse the destination page photo (cohort tile, jobs tile).
 * Internships and simulations share a lounge conversation photo.
 * CMS fallbacks may reuse a primary photo.
 *
 * Homepage hero fan (hero1–5) and cohort photos (cohortSpotlight, cohortPage)
 * are locked. Do not reassign those surfaces.
 */
export const img = {
  // Hero fan (homepage only)
  hero1: "/images/hero-1.jpg",
  hero2: "/images/hero-2.jpg",
  hero3: "/images/hero-3.jpg",
  hero4: "/images/hero-4.jpg",
  hero5: "/images/hero-5.jpg",

  // Lead instructor (portrait OK on cards/author byline)
  instructor: "/images/instructor-arielle.jpg",
  instructorTeaching: "/images/ddf.jpg",

  // Homepage sections (cohort spotlight locked)
  philosophy: "/images/photo_30_2026-07-11_04-15-51.jpg",
  communityHome: "/images/community-table.jpg",
  cohortSpotlight: "/images/cohort-group.jpg",

  // About
  aboutMission: "/images/presentation.jpg",
  academyGroup: "/images/photo_15_2026-07-11_04-15-51.jpg",

  // Community page gallery
  communityPortrait: "/images/photo_24_2026-07-11_04-15-51.jpg",
  communityCollab: "/images/photo_17_2026-07-11_04-15-51.jpg",
  communityEvent: "/images/photo_6_2026-07-11_04-15-50.jpg",
  communityCulture: "/images/fes.jpg",

  // Cohort program page (locked)
  cohortPage: "/images/cohort.jpg",

  // Mentorship
  mentorshipPair: "/images/photo_26_2026-07-11_04-15-51.jpg",
  mentorshipTalk: "/images/photo_16_2026-07-11_04-15-51.jpg",
  mentorSupport: "/images/photo_25_2026-07-11_04-15-51.jpg",
  mentorListen: "/images/photo_1_2026-07-11_04-15-50.jpg",

  // Courses
  learnSolo: "/images/self-paced.jpg",
  courseGrowth: "/images/photo_3_2026-07-11_04-15-50.jpg",
  courseAi: "/images/photo_8_2026-07-11_04-15-50.jpg",
  courseSocial: "/images/photo_27_2026-07-11_04-15-51.jpg",

  // Events
  eventsGathering: "/images/photo_19_2026-07-11_04-15-51.jpg",
  eventAi: "/images/photo_14_2026-07-11_04-15-50.jpg",
  eventPortfolio: "/images/photo_20_2026-07-11_04-15-51.jpg",
  eventWorkshop: "/images/workshop.jpg",

  // Careers & employers
  careersWork: "/images/events-rooftop.jpg",
  jobsFocus: "/images/photo_28_2026-07-11_04-15-51.jpg",
  internPath: "/images/photo_22_2026-07-11_04-15-51.jpg",
  hireConversation: "/images/photo_4_2026-07-11_04-15-50.jpg",

  // Contact, stories, simulations
  contactTalk: "/images/photo_29_2026-07-11_04-15-51.jpg",
  storiesLounge: "/images/photo_5_2026-07-11_04-15-50.jpg",
  storiesEmpty: "/images/photo_7_2026-07-11_04-15-50.jpg",
  practicePair: "/images/photo_22_2026-07-11_04-15-51.jpg",

  // Resources library — conceptual object photography
  resCalendar: "/images/resource-calendar.jpg",
  resAiPrompts: "/images/resource-ai-prompts.jpg",
  resBrief: "/images/resource-brief.jpg",
  resAudit: "/images/resource-audit.jpg",
  resWeekly: "/images/resource-weekly.jpg",
  resPortfolio: "/images/resource-portfolio.jpg",

  // Blog / insights covers — conceptual object photography
  postStrategy: "/images/insight-strategy.jpg",
  postAi: "/images/insight-ai.jpg",
  postCommunity: "/images/insight-community.jpg",
  postSocial: "/images/insight-social-system.jpg",
  postCareer: "/images/insight-portfolio.jpg",
  postB2b: "/images/insight-b2b.jpg",

  // Stories
  storyAda: "/images/story-ada.jpg",
  storyKwame: "/images/story-kwame.jpg",

  // Fallbacks (CMS only when media missing)
  default: "/images/self-paced.jpg",
  defaultEvent: "/images/photo_19_2026-07-11_04-15-51.jpg",
  defaultStory: "/images/hero-portrait.jpg",
  defaultPost: "/images/photo_8_2026-07-11_04-15-50.jpg",
} as const;

export type ImgKey = keyof typeof img;
