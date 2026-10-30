/**
 * Partner With Us page copy (ticket T8), including the Think Social Agency
 * section.
 *
 * Source: Tab 4 "04 Partner With Us" and "Think Social Agency", adjusted to
 * the Tab 5 brand rules where they conflict (Tab 5 wins). CTAs go to
 * /contact?type=... like the home PartnersBand. No hire, intern or job entry
 * points (Levi, T3).
 */

export const partnerHero = {
  kicker: "Partner With Us",
  title: "Build with the next generation of marketing talent.",
  lede: "Partner with Think Social Academy to support practical learning, create meaningful experiences and contribute to the growth of emerging marketing professionals.",
} as const;

export type PartnerArea = {
  id: string;
  title: string;
  body: string;
  examples: string[];
  note?: string;
  href: string;
  ctaLabel: string;
};

/** Tab 4 Sponsorship, Events and Simulations. Examples reuse lib/brand.ts partnerTracks. */
export const partnerAreas: PartnerArea[] = [
  {
    id: "sponsorship",
    title: "Sponsorship",
    body: "Support TSA programmes, learners, scholarships, events and community initiatives.",
    examples: ["Scholarships", "Programme seats", "Events", "Community initiatives", "Learning resources", "Learner access"],
    href: "/contact?type=Sponsorship",
    ctaLabel: "Discuss Sponsorship",
  },
  {
    id: "events",
    title: "Events",
    body: "Collaborate with TSA on webinars, panels, workshops, industry conversations and community events.",
    examples: ["Webinars", "Panels", "Workshops and masterclasses", "Guest sessions", "Industry conversations", "Community events"],
    href: "/contact?type=Collaboration",
    ctaLabel: "Partner on an Event",
  },
  {
    id: "simulations",
    title: "Simulations",
    body: "Give learners realistic marketing challenges, briefs or scenarios to solve as part of their learning experience.",
    examples: ["A marketing brief", "A campaign challenge", "A business scenario", "Feedback on learner work"],
    // Tab 5 section 10: label simulations clearly; no implied paid client work.
    note: "Learners may work through partner briefs or clearly labelled simulations, depending on the programme and opportunities available. These activities are designed to help learners practise applying concepts to realistic marketing challenges.",
    href: "/contact?type=Simulation%20waitlist",
    ctaLabel: "Create a Simulation",
  },
];

/** Tab 4 Think Social Agency. Tab 5: a separate arm, not an Academy programme. */
export const agency = {
  kicker: "Think Social Agency",
  title: "Social Media, Storytelling & Content",
  body: "Think Social Agency is the agency arm of Think Social, helping brands and organisations turn what they do into meaningful social media, stories and content. It works separately from the Academy's programmes.",
  focusAreas: [
    {
      title: "Social Media",
      body: "Strategy, content and platform management for digital platforms.",
    },
    {
      title: "Storytelling",
      body: "Finding and shaping meaningful stories from the work organisations are doing.",
    },
    {
      title: "Content",
      body: "Creating useful written and visual content for digital platforms.",
    },
  ],
  // TODO(placeholder): no Agency contact address, enquiry type or work samples exist yet.
  // Agency enquiries use the TSA contact form as a Partnership enquiry until Levi decides.
  href: "/contact?type=Partnership",
  ctaLabel: "Work With Think Social Agency",
} as const;

/** Team training lives in the Academy (Team & Organization Programs); point to it, do not duplicate it. */
export const partnerTeamTraining = {
  title: "Looking for team training?",
  body: "Tailored training for teams, organisations and groups is part of the Academy's Team & Organization Programs.",
  href: "/contact?type=Training%20request",
  ctaLabel: "Enquire about team training",
} as const;

export const partnerClose = {
  kicker: "Something else in mind?",
  title: "Have an idea we haven't listed?",
  lede: "Partnerships do not always fit neatly into a category. Tell us how your organisation would like to work with TSA and we'll follow up.",
  href: "/contact?type=Partnership",
  ctaLabel: "Start a conversation",
} as const;
