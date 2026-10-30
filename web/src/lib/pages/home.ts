/**
 * Homepage copy from the TSA Website Structure & Sitemap doc (Part 1).
 * Hero headline/CTAs live in site-settings; everything else here is structural copy.
 */

export const homepageFounder = {
  heading: "Founded by someone who learned this the hard way.",
  name: "Arielle Adodo",
  role: "Founder, Think Social Academy",
  ctaLabel: "Learn more about TSA",
  ctaHref: "/about",
  paragraphs: [
    "Arielle Adodo is a marketing professional whose experience spans consumer and lifestyle brands, technology, agency collaborations, and production, deepening her understanding of brand storytelling and how marketing supports business objectives.",
    "From a non-marketing background she transitioned into content creation and social media marketing through practice - developing content strategies for brands like Bel Aqua and subsidiary brands and building an understanding of how social media functions as a business tool rather than a broadcast channel.",
    "Over time, she noticed a consistent gap: people entering marketing roles or managing brand accounts were learning platform features and content formats without developing the strategic foundation that makes any of it useful. They could post. They struggled to plan, analyse, and connect their work to what could actually generate results for a brand or business.",
    "Think Social Academy was built to close that gap - not with another list of social media tips, but with a structured approach to training that combines strategy, practice and the experience that leaves you ready for opportunity in this market and beyond.",
    "The vision is simple: equip people not just to learn social media marketing, but to understand the work, apply their skills, and keep growing in the field.",
  ],
} as const;

export const homepageOfferings = {
  title: "Three ways to learn at TSA.",
  lede: "Choose the learning format that fits your situation.",
  items: [
    {
      title: "Social Media Marketing & AI Programme",
      meta: "4 weeks · Online · Cohort-based",
      body: "A structured four-week programme covering social media marketing from strategy through execution. You will develop your understanding of marketing objectives, content planning, smarter content creation with AI without giving up your creativity, platform management, AI tools, and analytic skills. Apply that knowledge through practical assignments and a developing portfolio.",
      audience:
        "People starting out in social media marketing, social media managers who upskill or learn to execute with AI, and those who want a structured, guided learning experience with tutor support.",
      ctaLabel: "Programme details",
      href: "/learn/social-media-marketing-ai-programme",
    },
    {
      title: "Specialised One-on-One Training",
      meta: "Tailored to your needs · 2 weeks · Flexible schedule",
      body: "Not everyone fits a standard cohort. If you are transitioning from another career, returning to marketing after time away, or working on a specific skill gap, one-on-one training gives you a structured learning experience built around your goals and your timeline.",
      audience:
        "Career changers, practising marketers with specific development needs, and individuals who need a more personalised pace and focus.",
      ctaLabel: "Find out more",
      href: "/learn/one-on-one-training",
    },
    {
      title: "The Marketing Workshop",
      meta: "Custom scope · Delivered to your team",
      body: "Practical, interactive workshops designed around an organisation's needs, helping teams strengthen their marketing knowledge and apply it to real business challenges tailored to this market. Training is scoped to your organisation's existing knowledge, objectives, and priorities - whether your team manages brand accounts, creates content, or oversees a wider communications function.",
      audience:
        "Businesses, institutions, schools, nonprofits, and public sector organisations with a team development need.",
      ctaLabel: "Start a conversation",
      href: "/learn/organisational-training",
    },
  ],
} as const;

export const homepageAudience = {
  title: "Who Is Think Social Academy For?",
  items: [
    {
      title: "Beginners, Graduates & Students",
      body: "Build your social media marketing skills and gain practical experience.",
    },
    {
      title: "Social Media Managers",
      body: "Strengthen your skills, sharpen your strategy, and learn to work smarter with AI.",
    },
    {
      title: "Business Owners",
      body: "Learn to use social media more effectively to market and grow your business.",
    },
    {
      title: "Teams & Organisations",
      body: "Develop your team's social media marketing skills through practical training.",
    },
  ],
} as const;

export const homepageValues = {
  title: "Our values",
  items: [
    {
      title: "Strategy before aesthetics",
      body: "A social media post is not a strategy. Learn to approach social media marketing with a clear understanding of the audience, brand, objectives, and context before deciding what to create or publish.",
    },
    {
      title: "AI-powered workflows",
      body: "Explore how AI tools can support research, planning, ideation, content development, and everyday marketing tasks while keeping human creativity and judgement at the centre.",
    },
    {
      title: "Practical experience",
      body: "Move beyond theory through guided assignments, campaign work, and opportunities to build a portfolio that demonstrates what you can do.",
    },
    {
      title: "Guided learning with tutor support",
      body: "Structured programmes at TSA include tutor guidance. Your tutor is accessible to you and you can easily get feedback and mentorship as you grow.",
    },
  ],
} as const;

export const homepageConnect = {
  title: "Part of something larger than a programme.",
  body: "TSA is building a community of people who stay updated with relevant resources, selected opportunities, events, and experiences that support their continued growth in social media marketing. Join the TSA community to receive updates on learning opportunities, events, partnerships, and other experiences selected for our audience.",
  ctaLabel: "Join the community",
  ctaHref: "/connect",
} as const;

export const homepageGrow = {
  title: "Keep learning between cohorts.",
  body: "The Grow section of the TSA website is a resource for people who want to build their social media marketing knowledge on their own terms. Practical articles, strategy guides, and marketing insights - written to be useful rather than to generate clicks.",
  topics: [
    "Social Media Strategy",
    "Content Marketing",
    "AI for Marketing",
    "Analytics & Performance",
    "Campaign Planning",
    "Social Media Marketing Careers",
  ],
  ctaLabel: "Explore articles",
  ctaHref: "/insights",
} as const;

export const homepageTestimonials = {
  lede: "Hear from learners about their experience with Think Social Academy and how the learning experience has shaped their skills and approach to social media marketing.",
} as const;

export const homepagePartner = {
  title: "Partner with us",
  body: "We partner with organisations, institutions, and brands to create opportunities for learning, professional development and deliver effective marketing solutions. Whether you’re interested in training, events, industry partnerships, supporting learners via sponsorship or need marketing support, we’d love to explore how we can work together.",
  ctaLabel: "Partner With Us",
  ctaHref: "/partner",
} as const;
