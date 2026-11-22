/** Global chrome copy from the website document. */

export const footerBrand =
  "Think Social Academy equips individuals, business owners and organizations with practical social media marketing skills, strategic thinking and tools for today's digital landscape.";

/** Footer column headings, in column order. */
export const footerColumnHeadings = { explore: "Explore", programs: "Programs", more: "More" } as const;

export const footerExplore = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Resources", href: "/resources" },
  { label: "Partnerships", href: "/partnerships" },
] as const;

export const footerAgencyLink = { label: "Agency", href: "/agency" } as const;

export const footerMore = [
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/partnerships" },
  { label: "Member sign in", href: "/login" },
] as const;

export const footerPrograms = [
  { label: "Social Media Marketing Program", href: "/programs/social-media-marketing" },
  { label: "Specialized One-on-One Training", href: "/programs/one-on-one-training" },
  { label: "Organizational Training", href: "/programs/organisational-training" },
] as const;

/** Homepage section 10. Also used by the site-wide footer module. */
export const subscribeModule = {
  heading: "Stay connected. Keep learning. Keep growing.",
  body: "Get practical resources, learning opportunities, industry insights and updates from Think Social Academy delivered straight to your inbox.",
  button: "Join the TSA community",
  success: "Thank you for joining the TSA community. Look out for updates from us in your inbox.",
} as const;

/** The only consent sentence in the document. Linked from every subscribe form. */
export const subscribePrivacy =
  "By subscribing, you agree to receive email updates from Think Social Academy. You can unsubscribe at any time.";
