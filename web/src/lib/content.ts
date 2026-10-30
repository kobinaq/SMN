import { img } from "@/lib/images";

export const instructor = {
  name: "Arielle Adodo",
  role: "Founder & Lead Instructor, Think Social Academy",
  title: "Marketing Strategist · Educator · Founder",
  image: img.instructor,
  headline: "Arielle Adodo",
  linkedin: "https://www.linkedin.com/in/arielle-adodo/",
  bio: "I didn’t start in marketing. I had to figure my way into it: no traditional marketing degree, no clear roadmap. I started with social media and content, learning through experience, experimenting, and working with brands until I realised there was much more to marketing than making good-looking content.",
  philosophy:
    "The more I worked across social, content, and digital, from FMCG and lifestyle to consumer and tech brands, the more I noticed a problem: social media marketing was evolving, but the way we teach it wasn’t. People were learning how to post before they learned how to think. I founded Social Marketers Network to close that gap, and to build the marketing community I wish I had when I started.",
  highlights: [
    "Social and digital marketing across FMCG, lifestyle, consumer, and technology brands",
    "Content strategy, brand storytelling, and marketing education",
    "Leads the Social Media Marketing & AI training path at TSA",
    "Building a marketing community across Africa and beyond",
  ],
  note: null as string | null,
};

/** Founder story for the About page — first-person, per the SMN brand voice. */
export const founderStory = [
  "I didn’t start in marketing. I had to figure my way into it.",
  "I didn’t have a traditional marketing degree or a clear roadmap telling me what to learn next. I started with social media and content, learning through experience, experimenting, working with brands, and gradually figuring out that there was much more to marketing than making good-looking content.",
  "Over the years, I worked across social media, content, and digital marketing, with experience spanning FMCG, lifestyle, consumer, and technology brands. But the more I worked in the industry, the more I noticed a problem: social media marketing was evolving, and the way we were teaching it wasn’t.",
  "Social media managers were no longer just being asked to keep a page active or create aesthetically pleasing content. Businesses wanted marketers who could understand the audience, develop strategy, contribute to campaigns, and ultimately help drive results. Yet many people entering the field were learning how to post before they learned how to think.",
  "There was also very little guidance around the things that actually help someone build a career: how to build a portfolio, how to price your work, how to communicate with clients, how to understand the business behind a brief, and what you actually need to learn to stay relevant as AI changes the industry.",
  "I know, because I spent years figuring it out myself. That’s why I founded Social Marketers Network, combining marketing strategy, social media, AI, practical application, career development, and professional experience. We’re building something bigger than a course: the marketing community I wish I had when I started, where learning can lead to experience, relationships, and opportunity.",
];

/** Founder philosophy — "What I believe". */
export const founderBeliefs = [
  {
    title: "Strategy before aesthetics",
    body: "Good marketing isn’t just about making something look good. It should have a reason to exist and a result it’s trying to create.",
  },
  {
    title: "Practice matters",
    body: "You can consume all the marketing content in the world. At some point, you have to do the work.",
  },
  {
    title: "The industry belongs to people who keep learning",
    body: "Marketing changes constantly. Staying relevant means staying curious.",
  },
  {
    title: "You shouldn’t have to figure it out alone",
    body: "The right community can shorten the learning curve, open doors, and make the journey much less isolating.",
  },
  {
    title: "Education should create opportunity",
    body: "A course shouldn’t be the finish line. It should help you become more capable, confident, and ready for what’s next.",
  },
];

/** SMN-specific values for the founder / about page. */
export const founderValues = [
  { title: "Practicality", body: "We teach what people can actually use." },
  { title: "Curiosity", body: "We stay open to new ideas, tools, and ways of working." },
  { title: "Community", body: "We believe people grow faster when they have people to grow with." },
  { title: "Relevance", body: "Our learning evolves with the industry." },
  { title: "Excellence", body: "We care about the quality of the work, not just completing the work." },
  { title: "Opportunity", body: "Education should create pathways to experience and careers." },
];

export const beliefs = [
  {
    title: "Think like a marketer",
    body: "Tools and trends do not automatically make you a marketer. Audiences, objectives, and business outcomes do.",
  },
  {
    title: "Practice beats theory alone",
    body: "You learn faster by doing real work, with feedback, community, and client-style projects.",
  },
  {
    title: "Growth never stops here",
    body: "Skills, community, and smart use of AI keep paying off long after a single course ends.",
  },
];

/**
 * Fallback hero copy when CMS site-settings are unavailable.
 * Prefer `getSiteSettings().homepage` / `useSiteSettings()` on public pages.
 */
export const homepageHero = {
  eyebrow: "Think Social Academy",
  lines: [
    "Learn the skills to deliver results for any brand or business using social media.",
  ],
  body: "Learn social media marketing, execute smarter and leave with real experience to become opportunity-ready.",
} as const;

/** Split a CMS headline into hero display lines (newlines, then sentence breaks). */
export function homepageHeadlineLines(headline: string): string[] {
  const trimmed = headline.trim();
  if (!trimmed) return [...homepageHero.lines];
  const byNewline = trimmed.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  const bySentence = trimmed
    .split(/(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
  return bySentence.length > 1 ? bySentence : [trimmed];
}

/** Tab 4 What is TSA, adjusted for Tab 5 (community, not professional network). */
export const homepageWhatIs = {
  title: "More than learning how to create content.",
  body: "Think Social Academy is a social media marketing academy and community that helps you build the knowledge, strategic skills and practical experience to use social media effectively and work towards results for brands and organisations.",
  ctaLabel: "Discover TSA",
  ctaHref: "/about",
} as const;

/**
 * Homepage founder essay (Tab 4 Why I Built TSA). About keeps founderStory.
 * Tab 5: no professional-network framing; no job or placement promises.
 */
export const homepageFounderStory = [
  "I've seen how fragmented learning marketing can be. You learn a tool here, a platform there, and a few content tricks, but you don't always learn how it all connects.",
  "Too often, people learn how to post before they learn how to think. They finish courses but do not know how to apply what they've learned, or how to take their next step.",
  "We want to change that.",
  "We want to build thinkers and doers, not just information absorbers. We don't want learning to end when a programme ends.",
  "Our vision is a community that keeps learning and helps the next person find their next step.",
];

export const smnValues = [
  {
    title: "Practicality",
    body: "We teach what people can actually use.",
  },
  {
    title: "Strategy over aesthetics",
    body: "Good marketing isn't just about making something look good. It should have a reason to exist and a result it's trying to create.",
  },
  {
    title: "Community",
    body: "We believe people grow faster when they have people to grow with.",
  },
  {
    title: "Relevance",
    body: "Our learning evolves with the industry.",
  },
  {
    title: "Opportunity",
    body: "Education should create pathways to practical experience and continued learning.",
  },
];

/** Tab 4 Explore TSA cards. */
export const homepageExplore = [
  {
    title: "Academy",
    body: "Build practical social media marketing and AI skills through structured learning.",
    ctaLabel: "See the 4-week cohort",
    href: "/learn/social-media-marketing-ai-programme",
  },
  {
    title: "Community",
    body: "Keep learning, stay connected to TSA updates, and continue growing beyond the classroom.",
    ctaLabel: "Join the community",
    href: "/connect",
  },
  {
    title: "Partner With Us",
    body: "Collaborate with TSA through sponsorships, events, simulations or our agency arm.",
    ctaLabel: "Partner With Us",
    href: "/partner",
  },
  {
    title: "Resources",
    body: "Access useful marketing knowledge, tools, templates and insights as they are published.",
    ctaLabel: "Explore Resources",
    href: "/grow",
  },
] as const;

/** Tab 4 Academy preview programmes + self-paced courses that already exist. */
export const homepageProgrammes = [
  {
    title: "Social Media Marketing & AI",
    meta: "4 weeks · Cohort-based",
    body: "Our core cohort programme for people who want to build practical social media marketing skills and learn how to integrate AI into their workflow.",
    href: "/learn/social-media-marketing-ai-programme",
    ctaLabel: "View the curriculum",
  },
  {
    title: "1-on-1 Specialized Learning",
    meta: "For individuals",
    // TODO(T5-placeholder): 1-on-1 booking flow does not exist yet; contact is the route.
    body: "Personalized learning designed around your specific goals, challenges or skill gaps.",
    href: "/contact?type=Training%20request",
    ctaLabel: "Enquire about 1-on-1",
  },
  {
    title: "Team & Organization Programs",
    meta: "For teams, organisations and groups",
    body: "Tailored learning experiences designed around the needs of teams, organisations and groups.",
    href: "/contact?type=Training%20request",
    ctaLabel: "Enquire about team training",
  },
  {
    title: "Self-paced courses",
    meta: "Learn on your schedule",
    body: "Individual courses you can work through in the member portal, with checkout when a course is published.",
    href: "/learn/courses",
    ctaLabel: "Browse self-paced courses",
  },
] as const;

/**
 * Tab 4 outcomes, adjusted for Tab 5.
 * End-of-cohort guidance day omitted: format and date are unconfirmed (inventory B5).
 */
export const homepageOutcomes: { title: string; body: string }[] = [
  {
    title: "A strategic mindset",
    body: "Think beyond posting and approach social media with purpose.",
  },
  {
    title: "Practical application",
    body: "Practise through guided briefs and clearly labelled simulations.",
  },
  {
    title: "An AI-powered workflow",
    body: "Use AI to research, think, plan and execute more effectively.",
  },
  {
    title: "A portfolio of work",
    body: "Show what you can do and how you think, subject to programme requirements.",
  },
  {
    title: "A TSA certificate",
    body: "Receive a TSA certificate upon successful completion.",
  },
];

/** Tab 4 Community preview, rewritten to Tab 5 community rules. */
export const homepageCommunity = {
  title: "Learning shouldn't end when the programme ends.",
  body: "The TSA community is an opt-in space for people who want to stay connected to Think Social Academy. Members can receive updates and early notices about selected learning experiences, partnerships, opportunities and events as they become available.",
  items: [
    "TSA updates",
    "Selected learning experiences",
    "Industry conversations when available",
    "Webinars and events when available",
    "Shared resources as they are published",
    "Early notice of selected activities",
  ],
} as const;

export const homepageClose = {
  lead: "Next step",
  title: "Ready to think beyond content?",
  paragraphs: [
    "Build the skills. Apply what you learn. Grow your experience. Stay connected.",
  ],
} as const;

export const homepagePartners = {
  title: "Build with Think Social Academy.",
  body: "There are different ways to support learners, create practical experiences and collaborate with TSA.",
  areas: [
    {
      title: "Sponsorship",
      body: "Support TSA programmes, learners, scholarships, events and initiatives.",
      href: "/contact?type=Sponsorship",
      ctaLabel: "Discuss sponsorship",
    },
    {
      title: "Events",
      body: "Collaborate on webinars, panels, workshops and industry conversations.",
      href: "/contact?type=Collaboration",
      ctaLabel: "Partner on an event",
    },
    {
      title: "Simulations",
      body: "Provide clearly labelled marketing briefs, challenges or scenarios for learners to solve.",
      href: "/contact?type=Simulation%20waitlist",
      ctaLabel: "Create a simulation",
    },
  ],
  agency: {
    title: "Think Social Agency",
    body: "Our agency arm works with brands and organisations on social media, storytelling and content. Enquiries go through Partner With Us.",
    href: "/partner",
    ctaLabel: "Partner With Us",
  },
  close: "Marketing is changing. How we learn it should too.",
} as const;

/** Tab 5 Learn. Apply. Grow. Connect. */
export const ecosystem: { title: string; body: string; kicker?: string }[] = [
  {
    title: "Learn",
    body: "Understand the principles and purpose behind social media marketing through clear instruction and practical lessons.",
  },
  {
    title: "Apply",
    body: "Practise through exercises, guided briefs, clearly labelled simulations, and portfolio work.",
  },
  {
    title: "Grow",
    body: "Develop through feedback, reflection, repeated practice, and exploration of different business contexts.",
  },
  {
    title: "Connect",
    body: "Stay connected to TSA updates, learning experiences, selected partnerships, opportunities and events as they become available.",
  },
];

/** Member journey steps for the homepage conversion narrative */
export const memberJourney = [
  {
    step: "01",
    title: "Learn practical marketing skills",
    body: "Strategy, research, brand, digital campaigns, analytics, and professional communication.",
  },
  {
    step: "02",
    title: "Practise through projects",
    body: "Assignments and client-style work that produce proof, not only notes.",
  },
  {
    step: "03",
    title: "Receive mentorship",
    body: "Request guidance from mentors on portfolio reviews, career questions, and stuck points.",
  },
  {
    step: "04",
    title: "Build a portfolio",
    body: "Document case studies on your public member profile.",
  },
  {
    step: "05",
    title: "Earn verifiable credentials",
    body: "Certificates that partners and learners can verify on TSA.",
  },
  {
    step: "06",
    title: "Discover opportunities",
    body: "Stay informed about selected opportunities and events inside the member platform.",
  },
];

export const capabilityAreas = [
  "Marketing strategy",
  "Market research",
  "Brand development",
  "Digital marketing",
  "Campaign planning",
  "Analytics",
  "Content strategy",
  "Customer understanding",
  "Professional communication",
  "Portfolio development",
  "Career readiness",
];

export type CourseItem = {
  slug: string;
  title: string;
  summary: string;
  outcomes: string[];
  duration: string;
  lessons: number;
  price: string;
  selarUrl: string;
  badge: string | null;
  image: string;
  id?: string | number;
  amount?: number | null;
  currency?: string;
  programKey?: string;
  delivery?: string;
  commerce?: "purchase" | "apply";
};

/** Real courses are managed in the CMS (`courses` collection). No seed placeholders. */
export const courses: CourseItem[] = [];

export type EventItem = {
  id?: string | number;
  slug: string;
  title: string;
  type: string;
  date: string;
  time: string;
  summary: string;
  /** @deprecated Prefer first-party /events/[slug] registration */
  registrationUrl: string;
  image: string;
  /** True when the CMS media upload is set (not the stock fallback). */
  hasCustomImage?: boolean;
  format: string;
  price: string;
  host: string;
  highlights: string[];
  pricing?: "free" | "paid";
  amount?: number | null;
  currency?: string;
  capacity?: number | null;
  venue?: string | null;
  address?: string | null;
  onlineUrl?: string | null;
  status?: string;
  updatedAt?: string;
};

export const eventTypes = ["All", "Webinar", "Workshop", "Networking"] as const;

/** Real events are managed in the CMS (`events` collection). No seed placeholders. */
export const events: EventItem[] = [];

export type ResourceItem = {
  slug: string;
  title: string;
  type: string;
  description: string;
  cover: string;
  format: string;
  level: string;
  featured?: boolean;
  free: boolean;
  highlights: string[];
  body: string[];
  /** Uploaded file URL when staff attached one in the CMS. */
  fileUrl?: string;
  updatedAt?: string;
};

/** Real resources are managed in the CMS (`resources` collection). No seed placeholders. */
export const resources: ResourceItem[] = [];

export const resourceTypes = [
  "All",
  "Template",
  "AI Prompts",
  "Checklist",
  "Toolkit",
  "Guide",
] as const;

/**
 * Seed testimonials are intentionally empty for public fallbacks.
 * Publish real stories in Payload (`stories` collection) with published=true.
 * Demo/fictional quotes must not appear on the marketing site.
 */
export const stories: {
  name: string;
  role: string;
  quote: string;
  image: string;
  programme?: string;
  portfolioUrl?: string;
}[] = [];

/** Short teaser for homepage and community. The stories page uses the full quote. */
export function excerptStoryQuote(quote: string, maxChars = 160) {
  const text = quote.replace(/\s+/g, " ").trim();
  if (text.length <= maxChars) return text;
  const clipped = text.slice(0, maxChars).replace(/\s+\S*$/, "").trim();
  return `${clipped || text.slice(0, maxChars)}…`;
}

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  cover: string;
  featured?: boolean;
  author: string;
  authorRole: string;
  authorImage: string;
  body: string[];
  updatedAt?: string;
};

/** Real insights are managed in the CMS (`posts` collection). No seed placeholders. */
export const posts: BlogPost[] = [];

export const blogCategories = [
  "All",
  "Social Media",
  "Marketing Strategy",
  "AI",
  "Career Development",
  "Industry Trends",
  "Case Studies",
] as const;

export const curriculum = [
  {
    week: "01",
    title: "Marketing Foundations",
    topics: ["Business and marketing objectives", "Target audiences", "Market and competitor research"],
  },
  {
    week: "02",
    title: "Content, Distribution and AI-Powered Marketing",
    topics: ["Content systems", "Distribution", "AI in the workflow"],
  },
  {
    week: "03",
    title: "Audience Growth and Community Building",
    topics: ["Audience growth", "Community", "Relationship building"],
  },
  {
    week: "04",
    title: "Analytics, Optimisation and Reporting",
    topics: ["Measurement", "Optimisation", "Reporting"],
  },
  {
    week: "05",
    title: "Personal Branding, Portfolio and Career Growth",
    topics: ["Personal brand", "Portfolio", "Career positioning"],
  },
  {
    week: "06",
    title: "Practical Experience",
    topics: ["Challenges", "Simulations", "Applied work"],
  },
];

export const cohortFaqs = [
  {
    q: "Who is this cohort for?",
    a: "Aspiring social media managers, students and graduates, freelancers, creators moving into marketing, early-career marketers, and existing social media professionals.",
  },
  {
    q: "How are live sessions delivered?",
    a: "Live sessions run on Google Classroom. Members also use the TSA member portal for learning progress, resources, mentorship, and opportunities. Get TSA updates on WhatsApp for day-to-day chat.",
  },
  {
    q: "Do I need prior experience?",
    a: "No. Curiosity, consistency, and a willingness to practise matter more than job titles.",
  },
  {
    q: "When do I pay?",
    a: "Submit an application first. TSA reviews applications within a few business days. Payment or an approved payment plan is arranged after acceptance, not before you apply.",
  },
  {
    q: "Is employment guaranteed?",
    a: "No. We help you practise marketing work and stay connected to selected opportunities when available. We do not promise a job.",
  },
  {
    q: "How do self-paced courses work?",
    a: "Purchase courses checkout on TSA via Paystack, then unlock in the member portal. Apply-first programmes use /apply. Staff grant access or send a payment link after review.",
  },
  {
    q: "What is the fee?",
    // TODO(T5-placeholder): fees unconfirmed.
    a: "Contact TSA for current fees. Payment plans may be available after acceptance.",
  },
];
