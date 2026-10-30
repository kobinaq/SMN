/**
 * /community copy (T7). Structure follows Tab 4 (03 Community); wording
 * follows Tab 5, which wins on conflicts: the community is opt-in, it is
 * about updates and selected activities, and it is not described as a
 * professional network or a WhatsApp group. Nothing here promises jobs,
 * internships, placements or income.
 */

export const communityHero = {
  kicker: "Community",
  title: "Keep learning. Keep growing. Stay connected.",
  lede: "The TSA community is an opt-in space for people interested in social media marketing, digital marketing and AI who want to stay connected to Think Social Academy.",
  note: "Joining is free. Create a TSA account to become a member.",
} as const;

export const communityAccess = {
  kicker: "Membership",
  title: "What members can access",
  lede: "Members get discussions, peer learning and community sessions inside their TSA account. They also receive updates and early notices about selected TSA activities as they become available.",
  items: [
    {
      title: "Member updates",
      body: "News from Think Social Academy, sent to members first.",
    },
    {
      title: "Industry conversations",
      body: "Conversations about social media marketing, digital marketing and AI, when they are scheduled.",
    },
    {
      title: "Webinars and events",
      body: "Notice of TSA webinars, workshops and events when they are announced.",
    },
    {
      title: "Shared resources",
      body: "Guides, tools and learning materials as they are published.",
    },
  ],
} as const;

export const communityEarlyAccess = {
  kicker: "Early notice",
  title: "Hear about selected activities first.",
  lede: "Members may receive early access or first notice of selected:",
  items: [
    "TSA events",
    "New programmes",
    "Resources",
    "Simulations",
    "Opportunities when available",
  ],
} as const;

export const communityMentors = {
  kicker: "Mentors",
  title: "Learn from people already doing the work.",
  lede: "The TSA mentor directory sits inside the community. Mentors are reviewed by TSA before they appear, and requests are coordinated through your member account.",
  ctaLabel: "Meet the mentors",
  href: "/connect/mentors",
} as const;

export const communityStories = {
  kicker: "In their words",
  title: "What members say",
} as const;

export const communityIdea = {
  kicker: "The idea",
  title: "Your learning doesn't have to end with your cohort.",
  lede: "TSA is building a community where members can continue learning, share what they know and help the next person figure out their next step.",
  ctaLabel: "Join TSA",
} as const;

export const communityMetadata = {
  title: "Community",
  description:
    "Join the Think Social Academy community. An opt-in way to stay connected to TSA updates, events, shared resources and early notice of selected activities.",
} as const;
