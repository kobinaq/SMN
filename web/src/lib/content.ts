import { img } from "@/lib/images";

export const instructor = {
  name: "Arielle Adodo",
  role: "Founder & Lead Instructor · Social Media Strategist (B2B & B2C)",
  image: img.instructor,
  headline: "Arielle Adodo",
  linkedin: "https://www.linkedin.com/in/arielle-adodo/",
  bio: "Arielle is a social media specialist and creative strategist based in Ghana. She builds stories that connect brands and creators to their audiences, with experience across B2B and B2C, including SaaS and tech.",
  philosophy:
    "She founded the Social Marketers Network to help beginners, social media managers, marketing professionals, and business owners move beyond random posting. SMN is more than an academy. It is a community and network for people who want strategy, AI skills, and real practice.",
  highlights: [
    "Social media strategist for B2B and B2C brands",
    "Content strategy, brand storytelling, and digital marketing education",
    "Leads the Social Media Marketing & AI training path at SMN",
    "Building a community for marketers across Africa and beyond",
  ],
  note: null as string | null,
};

export const beliefs = [
  {
    title: "Strategy over content tricks",
    body: "Businesses hire marketers to solve problems and drive results, not just to post.",
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
    body: "Strategy, social media, and AI, taught with real examples you can use on the job.",
  },
  {
    title: "Practice",
    body: "Assignments, simulations, and client projects that give you work to show.",
  },
  {
    title: "Connect",
    body: "WhatsApp community, mentors, and peers you can keep learning with after a program ends.",
  },
  {
    title: "Grow",
    body: "Career guidance, portfolios, and introductions to employers and partners.",
  },
];

export const courses = [
  {
    slug: "growth-marketing-foundations",
    title: "Growth Marketing Foundations",
    summary:
      "Build a clear growth system across channels, from positioning to how you find and keep customers.",
    outcomes: ["Channel strategy", "Experiment design", "Reporting frameworks"],
    duration: "6 hours",
    lessons: 24,
    price: "GHS 45,000",
    selarUrl: "https://selar.com/smn-growth-foundations",
    badge: "Recommended" as string | null,
    image: img.courseGrowth,
  },
  {
    slug: "ai-for-marketers",
    title: "AI for Marketers",
    summary:
      "Practical AI for research, content, campaign ideas, and analysis, without losing your judgment.",
    outcomes: ["Prompt systems", "Workflow design", "Quality control"],
    duration: "4 hours",
    lessons: 18,
    price: "GHS 38,000",
    selarUrl: "https://selar.com/smn-ai-marketers",
    badge: null,
    image: img.courseAi,
  },
  {
    slug: "social-strategy-systems",
    title: "Social Strategy Systems",
    summary:
      "Move past random posting. Build social plans that support real business goals.",
    outcomes: ["Audience insight", "Content systems", "Community loops"],
    duration: "5 hours",
    lessons: 20,
    price: "GHS 42,000",
    selarUrl: "https://selar.com/smn-social-systems",
    badge: null,
    image: img.courseSocial,
  },
];

export type EventItem = {
  slug: string;
  title: string;
  type: string;
  date: string;
  time: string;
  summary: string;
  registrationUrl: string;
  image: string;
  format: string;
  price: string;
  host: string;
  highlights: string[];
};

export const eventTypes = ["All", "Webinar", "Workshop", "Networking"] as const;

export const events: EventItem[] = [
  {
    slug: "ai-workflows-webinar",
    title: "AI Workflows for Social Marketers",
    type: "Webinar",
    date: "2026-08-14",
    time: "6:00 PM WAT",
    summary:
      "A free live session on using AI day to day for research, drafts, and reviews without handing over the thinking.",
    registrationUrl: "https://lu.ma/smn-ai-workflows",
    image: img.eventAi,
    format: "Online · Live",
    price: "Free",
    host: "Arielle Adodo",
    highlights: [
      "Practical AI workflows you can run the same week",
      "Prompt patterns for briefs, hooks, and audits",
      "Live Q&A for real marketing situations",
    ],
  },
  {
    slug: "portfolio-night",
    title: "Portfolio Night & Networking",
    type: "Networking",
    date: "2026-08-28",
    time: "5:30 PM WAT",
    summary:
      "Share work, get feedback, and meet peers and mentors in a small group setting built for marketers.",
    registrationUrl: "https://lu.ma/smn-portfolio-night",
    image: img.eventPortfolio,
    format: "Online · Small group",
    price: "Free · Limited seats",
    host: "SMN Mentors",
    highlights: [
      "Show one project and get constructive notes",
      "Meet peers working on similar goals",
      "Practice talking about your work with clarity",
    ],
  },
  {
    slug: "strategy-workshop",
    title: "Campaign Strategy Workshop",
    type: "Workshop",
    date: "2026-09-05",
    time: "10:00 AM WAT",
    summary:
      "Brief a campaign, design the plan, present your approach, and leave with critique you can use on real work.",
    registrationUrl: "https://lu.ma/smn-strategy-workshop",
    image: img.eventWorkshop,
    format: "Online · Hands-on",
    price: "Free · Application",
    host: "Arielle Adodo",
    highlights: [
      "Work from a real-style brief, not slides alone",
      "Build a simple campaign system in session",
      "Present and get feedback before you leave",
    ],
  },
];

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
};

export const resources: ResourceItem[] = [
  {
    slug: "content-calendar-system",
    title: "Content Calendar System",
    type: "Template",
    description: "A full-month planner for social teams that need clarity and consistency.",
    cover: img.resCalendar,
    format: "Spreadsheet + guide",
    level: "All levels",
    featured: true,
    free: true,
    highlights: [
      "Monthly planning grid by pillar and platform",
      "Status columns for draft, review, and live",
      "Simple capacity check so you stop over-planning",
    ],
    body: [
      "Random posting burns teams out. This calendar system helps you plan a full month around clear message pillars, realistic capacity, and a simple production flow.",
      "Use it for client work or your own brand. Fill pillars first, then formats, then dates. Review weekly so the plan stays useful instead of becoming wallpaper.",
    ],
  },
  {
    slug: "ai-prompt-library",
    title: "AI Prompt Library for Marketers",
    type: "AI Prompts",
    description: "Ready-to-use prompts for research, hooks, briefs, audits, and reporting.",
    cover: img.resAiPrompts,
    format: "PDF + copy pack",
    level: "Intermediate",
    free: true,
    highlights: [
      "Research and audience prompts",
      "Hook and brief generators with brand constraints",
      "Quality-check prompts so AI output stays on-brand",
    ],
    body: [
      "AI is only useful when the brief is clear. This library gives you prompts built for marketers, not generic chat.",
      "Each prompt includes what to paste in, what context to add, and how to review the output before it goes live.",
    ],
  },
  {
    slug: "campaign-brief-checklist",
    title: "Campaign Brief Checklist",
    type: "Checklist",
    description: "What to lock in before anyone starts making content.",
    cover: img.resBrief,
    format: "1-page checklist",
    level: "All levels",
    free: true,
    highlights: [
      "Goal, audience, and offer in plain language",
      "Must-say and must-not-say brand notes",
      "Success metrics you can actually track",
    ],
    body: [
      "Most campaign mess starts with a weak brief. This checklist forces clarity before design, copy, or posting begins.",
      "Run it with clients or internal teams. If a section is blank, you are not ready to produce yet.",
    ],
  },
  {
    slug: "social-audit-toolkit",
    title: "Social Audit Toolkit",
    type: "Toolkit",
    description: "A simple guide for reviewing brand presence, content, and community.",
    cover: img.resAudit,
    format: "Workbook",
    level: "Beginner to intermediate",
    free: true,
    highlights: [
      "Profile and content health checks",
      "Community and response patterns",
      "Priority fix list for the next 30 days",
    ],
    body: [
      "A social audit should end with decisions, not a long report no one reads. This toolkit walks you through presence, content, and community in a practical order.",
      "Finish with a short list of fixes ranked by impact so you know what to do next week.",
    ],
  },
  {
    slug: "weekly-content-system",
    title: "Weekly Content Operating System",
    type: "Guide",
    description: "A repeatable weekly rhythm for planning, creating, and reviewing content without chaos.",
    cover: img.resWeekly,
    format: "PDF guide",
    level: "All levels",
    free: true,
    highlights: [
      "Monday-to-Friday content ops rhythm",
      "Batching tips for solo marketers and small teams",
      "Friday review questions that improve next week",
    ],
    body: [
      "You do not need more motivation. You need a weekly rhythm. This guide maps a simple operating system for social work that fits real life.",
      "Use it alone or with a team. The goal is fewer fire drills and more consistent shipping.",
    ],
  },
  {
    slug: "portfolio-case-study-template",
    title: "Portfolio Case Study Template",
    type: "Template",
    description: "Show the problem, plan, and result so hiring managers see how you think.",
    cover: img.resPortfolio,
    format: "Doc template",
    level: "Career-focused",
    free: true,
    highlights: [
      "Case study structure that works for junior and mid-level roles",
      "Prompt questions when you have limited metrics",
      "Before/after framing for practice projects",
    ],
    body: [
      "Pretty screenshots are not a portfolio. This template helps you turn work into a clear story: context, goal, approach, outcome.",
      "Use real client work or practice projects. Clarity beats perfection.",
    ],
  },
];

export const resourceTypes = [
  "All",
  "Template",
  "AI Prompts",
  "Checklist",
  "Toolkit",
  "Guide",
] as const;

export const stories = [
  {
    name: "Ada Okonkwo",
    role: "Social Media Manager to Growth Lead",
    quote:
      "SMN didn’t just teach me tools. It taught me how to think. I left with a portfolio, a network, and a clearer career path.",
    image: img.storyAda,
  },
  {
    name: "Kwame Mensah",
    role: "Freelance Marketer",
    quote:
      "The community is what sets it apart. I got feedback, mentors, and systems I still use with clients every week.",
    image: img.storyKwame,
  },
];

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

export const posts: BlogPost[] = [
  {
    slug: "strategy-before-content",
    title: "Strategy Before Content: Why Brands Hire Thinkers",
    category: "Marketing Strategy",
    excerpt:
      "Businesses don’t hire marketers just to post. They hire people who understand audiences, problems, and results.",
    date: "2026-06-12",
    readTime: "6 min",
    cover: img.postStrategy,
    featured: true,
    author: "Arielle Adodo",
    authorRole: "Founder & Lead Instructor",
    authorImage: img.instructor,
    body: [
      "Businesses don’t hire marketers just to post. They hire people who understand audiences, problems, and results. Content is the output. Strategy is the reason the output works.",
      "If you start with a content calendar and no clear offer, no audience insight, and no measure of success, you will stay busy and still struggle to prove impact. Brands notice that gap quickly.",
      "A stronger habit is to answer a few hard questions first. Who is this for? What problem are we solving? What does success look like in 30 days? Only then do you choose channels, formats, and hooks.",
      "At Social Marketers Network, we teach marketers to think in systems: research, positioning, content, distribution, and review. That is how you move from “I made content” to “I moved the business.”",
      "If this resonates, explore the flagship cohort, join the WhatsApp community, or start with a self-paced course on Selar.",
    ],
  },
  {
    slug: "ai-enhances-marketers",
    title: "AI Helps Marketers. It Does Not Replace Them",
    category: "AI",
    excerpt:
      "The people who get the most from AI still bring judgment, taste, and a clear plan.",
    date: "2026-06-28",
    readTime: "5 min",
    cover: img.postAi,
    author: "Arielle Adodo",
    authorRole: "Founder & Lead Instructor",
    authorImage: img.instructor,
    body: [
      "AI can speed up research, drafting, and analysis. That is real. What it cannot replace is judgment: knowing what is worth saying, what is on-brand, and what will actually move your audience.",
      "The marketers who get the most from AI treat it like a junior teammate. They give clear briefs, check the work, and keep ownership of the strategy.",
      "A practical workflow looks like this: define the goal, gather context, generate options with AI, then edit with human taste and brand knowledge. Skip the edit step and you get generic content that sounds like everyone else.",
      "In the SMN Social Media Marketing & AI path, we focus on workflows you can run every week: research prompts, content systems, quality checks, and reporting that still needs a human story.",
      "Use the tools. Keep the thinking. That combination is what brands pay for.",
    ],
  },
  {
    slug: "building-in-public-community",
    title: "Why Community Speeds Up Marketing Careers",
    category: "Career Development",
    excerpt:
      "Learning alone is slow. The right people around you make skill, confidence, and opportunity easier to reach.",
    date: "2026-07-02",
    readTime: "7 min",
    cover: img.postCommunity,
    author: "Arielle Adodo",
    authorRole: "Founder & Lead Instructor",
    authorImage: img.instructor,
    body: [
      "Learning alone is slow. You can watch every tutorial online and still freeze when it is time to ship work or ask for feedback.",
      "Community shortens that gap. Peers catch blind spots. Mentors share patterns they have already learned the hard way. Opportunities often show up in conversations, not in job boards alone.",
      "That is why SMN is built as a network, not only a set of lessons. Classes matter. WhatsApp support, portfolio feedback, and shared wins matter just as much.",
      "If you are early in your marketing career, do not wait until you “feel ready” to join a room of people learning the same craft. Consistency plus community beats isolation almost every time.",
      "Join the WhatsApp community, come to an event, or apply to the next cohort. You do not have to figure everything out alone.",
    ],
  },
  {
    slug: "social-systems-not-random-posts",
    title: "Stop Random Posting. Build a Social System.",
    category: "Social Media",
    excerpt:
      "A calendar is not a strategy. Here is a simple system for content that supports real business goals.",
    date: "2026-07-08",
    readTime: "6 min",
    cover: img.postSocial,
    author: "Arielle Adodo",
    authorRole: "Founder & Lead Instructor",
    authorImage: img.instructor,
    body: [
      "Many teams post every day and still feel stuck. The issue is rarely effort. It is the lack of a system that connects content to a clear goal.",
      "A useful social system has four parts: audience insight, message pillars, a production rhythm, and a review loop. Miss one and you drift into random posting again.",
      "Start with one business goal for the month. Then choose three message pillars that support that goal. Plan formats that fit your capacity, not an influencer’s schedule.",
      "Every two weeks, review what earned attention, conversation, or leads. Keep what works. Drop what does not. That is how social becomes a growth channel, not a chore.",
      "If you want a structured way to build this, the self-paced Social Strategy Systems course and the flagship cohort both go deep on systems you can reuse.",
    ],
  },
  {
    slug: "portfolio-that-gets-you-hired",
    title: "Build a Marketing Portfolio That Gets You Hired",
    category: "Career Development",
    excerpt:
      "Screenshots of posts are not enough. Show the problem, the plan, and the result.",
    date: "2026-05-20",
    readTime: "8 min",
    cover: img.postCareer,
    author: "Arielle Adodo",
    authorRole: "Founder & Lead Instructor",
    authorImage: img.instructor,
    body: [
      "A strong marketing portfolio does not only show pretty posts. It shows how you think. Hiring managers want to see the problem, your approach, and what changed.",
      "For each project, write a short case study: context, goal, audience, what you did, and the outcome. Even small wins count if the story is clear.",
      "If you do not have client work yet, create practice projects. Audit a brand, redesign a content system, or run a mock campaign with real constraints. Document the process.",
      "Inside SMN, portfolio work is part of the learning path for a reason. Skills stick when you can point to proof.",
      "Start with one case study this week. Then another. Momentum beats waiting for the perfect brief.",
    ],
  },
  {
    slug: "b2b-social-without-the-boredom",
    title: "B2B Social Without the Boredom",
    category: "Marketing Strategy",
    excerpt:
      "B2B audiences are still people. Clarity, proof, and useful stories beat jargon every time.",
    date: "2026-05-05",
    readTime: "5 min",
    cover: img.postB2b,
    author: "Arielle Adodo",
    authorRole: "Founder & Lead Instructor",
    authorImage: img.instructor,
    body: [
      "B2B social often fails because it sounds like a brochure. Decision-makers still want clarity, proof, and a reason to care.",
      "Lead with a problem your buyer actually feels. Support it with examples, numbers when you have them, and a clear next step. That works better than a list of product features.",
      "You can be professional without being dull. Short stories from customers, behind-the-scenes process, and honest lessons from campaigns all perform well in B2B feeds.",
      "If you work in SaaS or services, treat social as a trust channel. Consistency and usefulness matter more than viral tricks.",
      "Want to go deeper on B2B and social strategy? Join an upcoming webinar or explore the cohort curriculum.",
    ],
  },
];

export const blogCategories = [
  "All",
  "Marketing Strategy",
  "AI",
  "Social Media",
  "Career Development",
] as const;

export const curriculum = [
  {
    week: "01",
    title: "Marketing Foundations & Positioning",
    topics: ["Market insight", "Positioning", "Offer clarity"],
  },
  {
    week: "02",
    title: "Audience & Research",
    topics: ["Personas that work", "Jobs to be done", "Research habits"],
  },
  {
    week: "03",
    title: "Social Strategy",
    topics: ["Content systems", "Platform strategy", "Community loops"],
  },
  {
    week: "04",
    title: "AI for Marketing Work",
    topics: ["Prompt systems", "Ops automation", "Quality control"],
  },
  {
    week: "05",
    title: "Campaign Design & Execution",
    topics: ["Briefs", "Creative direction", "Measurement plans"],
  },
  {
    week: "06",
    title: "Analytics & Decision Making",
    topics: ["Dashboards", "Experiments", "Reporting that tells a story"],
  },
  {
    week: "07",
    title: "Portfolio & Career Craft",
    topics: ["Case studies", "Personal brand", "Interview prep"],
  },
  {
    week: "08",
    title: "Client Experience Sprint",
    topics: ["Live project", "Feedback", "Presentation day"],
  },
];

export const cohortFaqs = [
  {
    q: "Who is this cohort for?",
    a: "Beginners, social media managers, freelancers, and marketers who want real strategy, not only content tips.",
  },
  {
    q: "How are live sessions delivered?",
    a: "Live sessions run on Google Classroom. You’ll also join the SMN WhatsApp community for feedback and support.",
  },
  {
    q: "Do I need prior experience?",
    a: "No. Curiosity, consistency, and a willingness to practice matter more than job titles.",
  },
  {
    q: "Is employment guaranteed?",
    a: "No. We help you get ready for the market and open doors to employers and opportunities. We do not promise a job.",
  },
  {
    q: "How do self-paced courses work?",
    a: "Self-paced courses are sold and delivered through Selar. Browse them here, then enroll on Selar.",
  },
];
