import { img } from "@/lib/images";

export const instructor = {
  name: "Arielle Adodo",
  role: "Founder & Lead Instructor, Social Marketers Network",
  title: "Marketing Strategist · Educator · Founder",
  image: img.instructor,
  headline: "Arielle Adodo",
  linkedin: "https://www.linkedin.com/in/arielle-adodo/",
  bio: "I didn’t start in marketing. I had to figure my way into it — no traditional marketing degree, no clear roadmap. I started with social media and content, learning through experience, experimenting, and working with brands until I realised there was much more to marketing than making good-looking content.",
  philosophy:
    "The more I worked across social, content, and digital — from FMCG and lifestyle to consumer and tech brands — the more I noticed a problem: social media marketing was evolving, but the way we teach it wasn’t. People were learning how to post before they learned how to think. I founded Social Marketers Network to close that gap, and to build the marketing community I wish I had when I started.",
  highlights: [
    "Social and digital marketing across FMCG, lifestyle, consumer, and technology brands",
    "Content strategy, brand storytelling, and marketing education",
    "Leads the Social Media Marketing & AI training path at SMN",
    "Building a marketing community across Africa and beyond",
  ],
  note: null as string | null,
};

/** Founder story for the About page — first-person, per the SMN brand voice. */
export const founderStory = [
  "I didn’t start in marketing. I had to figure my way into it.",
  "I didn’t have a traditional marketing degree or a clear roadmap telling me what to learn next. I started with social media and content — learning through experience, experimenting, working with brands, and gradually figuring out that there was much more to marketing than making good-looking content.",
  "Over the years, I worked across social media, content, and digital marketing, with experience spanning FMCG, lifestyle, consumer, and technology brands. But the more I worked in the industry, the more I noticed a problem: social media marketing was evolving, and the way we were teaching it wasn’t.",
  "Social media managers were no longer just being asked to keep a page active or create aesthetically pleasing content. Businesses wanted marketers who could understand the audience, develop strategy, contribute to campaigns, and ultimately help drive results. Yet many people entering the field were learning how to post before they learned how to think.",
  "There was also very little guidance around the things that actually help someone build a career: how to build a portfolio, how to price your work, how to communicate with clients, how to understand the business behind a brief, and what you actually need to learn to stay relevant as AI changes the industry.",
  "I know, because I spent years figuring it out myself. That’s why I founded Social Marketers Network — combining marketing strategy, social media, AI, practical application, career development, and professional experience. We’re building something bigger than a course: the marketing community I wish I had when I started, where learning can lead to experience, relationships, and opportunity.",
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

export const ecosystem = [
  {
    title: "Learn",
    body: "Training programmes, self-paced courses, webinars, and practical resources.",
  },
  {
    title: "Practice",
    body: "Simulations, projects, and real-world marketing experiences.",
  },
  {
    title: "Connect",
    body: "Community, events, mentorship, and professional relationships.",
  },
  {
    title: "Grow",
    body: "Career development, opportunities, and continuous learning.",
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
    body: "Certificates that employers and partners can verify on SMN.",
  },
  {
    step: "06",
    title: "Discover opportunities",
    body: "Find and track marketing roles and gigs inside the member platform.",
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
    a: "Live sessions run on Google Classroom. Members also use the SMN member portal for learning progress, resources, mentorship, and opportunities, plus the WhatsApp community for day-to-day support.",
  },
  {
    q: "Do I need prior experience?",
    a: "No. Curiosity, consistency, and a willingness to practise matter more than job titles.",
  },
  {
    q: "When do I pay?",
    a: "Submit an application first. SMN reviews applications within a few business days. Payment or an approved payment plan is arranged after acceptance, not before you apply.",
  },
  {
    q: "Is employment guaranteed?",
    a: "No. We help you get ready for the market and open doors to employers and opportunities. We do not promise a job.",
  },
  {
    q: "How do self-paced courses work?",
    a: "Purchase courses checkout on SMN via Paystack, then unlock in the member portal. Apply-first programmes use /apply. Staff grant access or send a payment link after review.",
  },
  {
    q: "What is the fee?",
    a: "Contact SMN for current fees. Payment plans may be available after acceptance.",
  },
];
