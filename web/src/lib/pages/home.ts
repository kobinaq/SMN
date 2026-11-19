/**
 * Homepage copy from the website document, placed as written.
 * Section 6 is not in the document. Section 8 renders only when approved stories exist.
 */

export const homepageSeo = {
  title: "Think Social Academy | Social Media Marketing Skills & Training",
  description:
    "Build practical social media marketing skills with Think Social Academy. Explore professional training, specialised learning and organisational programmes.",
} as const;

export const homepageHero = {
  eyebrow: "THINK SOCIAL ACADEMY",
  headline: "Build social media marketing skills that make you opportunity-ready.",
  supporting:
    "Learn social media marketing skills, execute smarter and grow any brand or business. Whether you are starting out, strengthening your professional skills or developing your team's capabilities, TSA offers practical learning grounded in strategy, application and the realities of the industry.",
  primaryCtaLabel: "Explore our programmes",
  primaryCtaHref: "/programs",
  secondaryCtaLabel: "Discover TSA",
  secondaryCtaHref: "/about",
} as const;

export const homepageFounder = {
  heading: "Built from experience. Designed for practical learning.",
  name: "Arielle Adodo",
  role: "Founder, Think Social Academy",
  ctaLabel: "More about our story",
  ctaHref: "/about",
  paragraphs: [
    "Coming from a non-marketing background, much of my learning happened through a combination of disconnected online courses and figuring things out along the way. Most learners encountered many learning resources, developed around international standards and practices, but they often existed as disconnected pieces. The real challenge began when they had to apply their knowledge to local business contexts and translate it into practical skills. Knowing how to price, build a portfolio and land clients was another hurdle.",
    "Even while navigating agency environments and taking on projects ranging from brands like consumer, lifestyle, podcast and now technology, finding guidance and knowing what to do next wasn't straightforward. The field was new, broad, constantly evolving and difficult to navigate without a clear learning path.",
    "I also observed a recurring gap: people could learn platform features and content formats without necessarily developing the strategic foundation needed to make their work effective. They could publish content, but often needed more support to plan strategically, analyse performance and connect their work to business objectives.",
    "These experiences shaped my decision to build Think Social Academy and give learners a more structured learning experience, one that connects strategic understanding with practical application and professional development so while making relevant skills and knowledge more accessible to individuals, businesses and organisations.",
  ],
} as const;

export const homepageOfferings = {
  title: "Learning offerings",
  items: [
    {
      title: "Social Media Marketing Programme",
      meta: "",
      body: "A structured learning experience for beginners, aspiring professionals, practising social media marketers and business owners who want to understand and apply social media marketing.",
      audience: "",
      ctaLabel: "Explore programme",
      href: "/programs/social-media-marketing",
    },
    {
      title: "One-on-One Training",
      meta: "",
      body: "Personalised training built around your learning goals, professional development needs and specific skill gaps.",
      audience: "",
      ctaLabel: "Enquire about training",
      href: "/programs/one-on-one-training",
    },
    {
      title: "Organisational Training",
      meta: "",
      body: "Tailored training programmes and workshops that help organisations and teams strengthen their social media marketing capabilities.",
      audience: "",
      ctaLabel: "Request team training",
      href: "/programs/organisational-training",
    },
  ],
} as const;

export const homepageAudience = {
  title: "Who we serve",
  items: [
    {
      title: "Beginners, students and graduates",
      body: "Build a strong foundation in social media marketing and develop practical experience.",
    },
    {
      title: "Aspiring and practising social media professionals",
      body: "Strengthen your strategy, improve execution and learn to work smarter with relevant tools and AI.",
    },
    {
      title: "Business owners",
      body: "Understand how to use social media more intentionally to communicate your value, connect with customers and support business goals.",
    },
    {
      title: "Teams and organisations",
      body: "Develop your team's social media marketing knowledge through structured, practical training.",
    },
  ],
} as const;

export const homepageValues = {
  title: "The TSA approach",
  items: [
    {
      title: "Local relevance, global developments",
      body: "We combine an understanding of local brand contexts with knowledge of global marketing standards, developments and best practices.",
    },
    {
      title: "Practical application",
      body: "We create opportunities for learners to put their knowledge into practice through exercises, projects and real-world scenarios.",
    },
    {
      title: "Guided learning",
      body: "Learners benefit from structured instruction, feedback and guidance that support their development.",
    },
    {
      title: "Strategic thinking",
      body: "We encourage learners to understand the purpose behind marketing decisions, not simply follow trends or reproduce tactics.",
    },
    {
      title: "Continuous learning",
      body: "Social media is constantly evolving. We encourage curiosity, adaptability and the ability to keep learning, including the effective use of AI.",
    },
  ],
} as const;

export const homepageGrow = {
  kicker: "Resources",
  title: "",
  body: "Explore practical guides, useful tools and perspectives on social media strategy, content, AI for marketing, campaign planning and professional development. Resources are designed to help you keep building your knowledge and apply what you learn.",
  topics: [] as readonly string[],
  ctaLabel: "Explore resources",
  ctaHref: "/resources",
} as const;

export const homepageTestimonials = {
  lede: "Hear from learners about their experience with Think Social Academy and how the learning has shaped their skills, confidence and approach to social media marketing.",
} as const;

export const homepagePartner = {
  title: "Let's create, learn and grow together.",
  body: "We work with institutions, organisations, educators and brands to create meaningful learning experiences, expand access to practical skills and explore opportunities for collaboration.",
  agencyBody:
    "Through our agency, we also support businesses with strategic marketing and creative execution",
  ctaLabel: "Explore partnerships",
  ctaHref: "/partnerships",
  agencyCtaLabel: "Work with our agency",
  agencyCtaHref: "/agency",
} as const;
