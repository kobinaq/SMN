/**
 * Central image map — each path is used for one visual surface
 * so the site does not repeat the same photo across sections.
 *
 * Exception: instructor / author avatar may reuse the same portrait
 * (same person). Logos may appear in header + footer.
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

  // Homepage sections
  philosophy: "/images/photo_3_2026-07-11_04-15-50.jpg",
  communityHome: "/images/photo_5_2026-07-11_04-15-50.jpg",
  cohortSpotlight: "/images/cohort-group.jpg",

  // About
  aboutMission: "/images/photo_4_2026-07-11_04-15-50.jpg",

  // Community page gallery
  communityPortrait: "/images/photo_1_2026-07-11_04-15-50.jpg",
  communityCollab: "/images/photo_17_2026-07-11_04-15-51.jpg",
  communityEvent: "/images/photo_6_2026-07-11_04-15-50.jpg",
  communityCulture: "/images/fes.jpg",

  // Cohort program page
  cohortPage: "/images/cohort.jpg",

  // Courses
  courseGrowth: "/images/photo_14_2026-07-11_04-15-50.jpg",
  courseAi: "/images/photo_15_2026-07-11_04-15-51.jpg",
  courseSocial: "/images/photo_16_2026-07-11_04-15-51.jpg",

  // Events
  eventAi: "/images/photo_19_2026-07-11_04-15-51.jpg",
  eventPortfolio: "/images/photo_20_2026-07-11_04-15-51.jpg",
  eventWorkshop: "/images/photo_22_2026-07-11_04-15-51.jpg",

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
  defaultEvent: "/images/photo_7_2026-07-11_04-15-50.jpg",
  defaultStory: "/images/hero-portrait.jpg",
  defaultPost: "/images/photo_8_2026-07-11_04-15-50.jpg",
} as const;

export type ImgKey = keyof typeof img;
