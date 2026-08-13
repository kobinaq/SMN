import { cta } from "@/lib/cta";

/** SEO title: Primary Keyword | Social Marketers Network */
export function seoTitle(keyword: string) {
  return { absolute: `${keyword} | Social Marketers Network` } as const;
}

export const audienceStages = [
  {
    title: "Starting out",
    body: "Build your foundation, discover your strengths, and understand where marketing can take you.",
  },
  {
    title: "Building your career",
    body: "Develop strategic skills, gain practical experience, and strengthen your professional profile.",
  },
  {
    title: "Already in marketing",
    body: "Stay current, sharpen your thinking, and connect with people across the industry.",
  },
  {
    title: "Building a business",
    body: "Understand marketing better and connect with people who can help you grow.",
  },
];

export const thinkPillars = [
  {
    title: "Strategy",
    body: "Understand the business behind the brief and connect marketing activity to meaningful objectives.",
  },
  {
    title: "Social media and AI",
    body: "Use social platforms to build brands, communities, and businesses. Use AI to improve research, thinking, workflows, and productivity without losing the human side of marketing.",
  },
  {
    title: "Experience",
    body: "Move beyond theory through simulations, projects, and opportunities to apply what you learn.",
  },
  {
    title: "Community",
    body: "Build relationships with other marketers, practitioners, mentors, and people navigating the industry alongside you.",
  },
];

export const trainingModules = [
  {
    module: "01",
    title: "Marketing Foundations",
    body: "Understand how marketing works beyond social media.",
    topics: [
      "Identify business and marketing objectives",
      "Understand target audiences",
      "Research markets and competitors",
      "Develop marketing objectives",
      "Connect marketing activity to business outcomes",
    ],
  },
  {
    module: "02",
    title: "Content, Distribution and AI-Powered Marketing",
    body: "Turn strategy into effective content and use AI as part of your marketing workflow.",
    topics: ["Content systems", "Distribution", "AI in the workflow"],
  },
  {
    module: "03",
    title: "Audience Growth and Community Building",
    body: "Understand, attract, and build relationships with the people your brand serves.",
    topics: ["Audience growth", "Community", "Relationship building"],
  },
  {
    module: "04",
    title: "Analytics, Optimisation and Reporting",
    body: "Measure performance, interpret data, and make better marketing decisions.",
    topics: ["Measurement", "Optimisation", "Reporting"],
  },
  {
    module: "05",
    title: "Personal Branding, Portfolio and Career Growth",
    body: "Communicate your skills, build your portfolio, and position yourself for opportunities.",
    topics: ["Personal brand", "Portfolio", "Career positioning"],
  },
  {
    module: "06",
    title: "Practical Experience",
    body: "Apply what you have learned through practical challenges, simulations, and opportunities for real-world experience.",
    topics: ["Challenges", "Simulations", "Applied work"],
  },
];

export const trainingOutcomes = [
  "Build a social media strategy",
  "Conduct audience research",
  "Develop content strategies",
  "Create marketing campaigns",
  "Use AI in a marketing workflow",
  "Analyse social media performance",
  "Present marketing recommendations",
  "Build a professional portfolio",
  "Think beyond individual posts and platforms",
  "Approach marketing problems strategically",
];

export const trainingLearnApply = [
  {
    title: "Live learning",
    body: "Learn directly through structured sessions and practical discussions.",
  },
  {
    title: "Practical frameworks",
    body: "Use frameworks that help you approach real marketing problems.",
  },
  {
    title: "AI-powered workflows",
    body: "Learn where AI can improve research, ideation, execution, and analysis.",
  },
  {
    title: "Community",
    body: "Learn alongside other aspiring and early-career marketers.",
  },
  {
    title: "Mentorship",
    body: "Gain access to guidance from marketing professionals.",
  },
  {
    title: "Experience",
    body: "Move from learning into practical marketing experience.",
  },
];

export const courseCategories = [
  {
    title: "Social Media Marketing",
    body: "Build the foundations of effective social media marketing.",
  },
  {
    title: "Content Strategy",
    body: "Learn how to plan content with purpose.",
  },
  {
    title: "AI for Marketers",
    body: "Learn practical ways to integrate AI into your marketing workflow.",
  },
  {
    title: "Marketing Strategy",
    body: "Develop the strategic thinking needed to solve marketing problems.",
  },
  {
    title: "Career Development",
    body: "Build your portfolio, professional profile, and career confidence.",
  },
];

export const simulationPractice = [
  "Audience research",
  "Content strategy",
  "Campaign planning",
  "Marketing strategy",
  "Social media management",
  "Analytics",
  "Communication",
  "Presenting recommendations",
];

export const experienceDeliverables = [
  {
    title: "Marketing brief / challenge",
    body: "A real or approved project brief showing the problem they were asked to solve.",
  },
  {
    title: "Audience research",
    body: "A documented audience, market, or competitor research exercise.",
  },
  {
    title: "Strategy",
    body: "A social media, content, campaign, or marketing strategy developed in response to the brief.",
  },
  {
    title: "Content plan",
    body: "A content calendar, campaign plan, or distribution plan.",
  },
  {
    title: "Creative execution",
    body: "Examples of content, campaigns, copy, creative concepts, or other marketing assets they contributed to.",
  },
  {
    title: "Analytics and reporting",
    body: "Where data is available, a performance report showing what happened, what was learned, and what they would recommend next.",
  },
  {
    title: "Case study",
    body: "A short portfolio case study covering challenge, research, strategy, execution, and results or learning.",
  },
  {
    title: "Professional feedback",
    body: "A short assessment, testimonial, or recommendation from the mentor or organisation.",
  },
];

export const partnerTracks = [
  {
    id: "train",
    n: "01",
    kicker: "Train and develop",
    title: "Build marketing capabilities within your organisation",
    body: "We work with organisations to design specialised training around their teams, industry, and needs.",
    items: [
      "Custom marketing training programmes",
      "Social media and digital marketing training",
      "AI for marketing teams",
      "Marketing strategy workshops",
      "Personal branding",
      "Marketing analytics",
      "Team upskilling",
      "Industry-specific learning programmes",
    ],
    bestFor: "Organisations looking to develop their teams and build relevant marketing capabilities.",
    href: "/contact#message",
    cta: "Build a training programme",
    formType: "Training request",
  },
  {
    id: "hire",
    n: "02",
    kicker: "Hire interns and experience",
    title: "Hire SMN talent",
    body: "Find emerging talent. Create real-world opportunities. Partner with SMN to connect with marketers who are building practical skills and looking to apply them. We can help match opportunities with participants based on their skills, interests, and career direction.",
    items: [
      "Hire interns",
      "Recruit junior talent",
      "Offer volunteer opportunities",
      "Provide freelance or project-based work",
      "Create SMN Experience projects",
      "Give participants real marketing briefs",
      "Collaborate on portfolio-building projects",
    ],
    bestFor: "Brands, agencies, and organisations looking for emerging marketing talent or additional project support.",
    href: "#employer-form",
    cta: cta.hireTalent.label,
    formType: "Talent request",
  },
  {
    id: "collaborate",
    n: "03",
    kicker: "Create and collaborate",
    title: "Bring your expertise, brand, or ideas into the Network",
    body: "Build meaningful experiences for marketers through collaborative programmes and industry initiatives. Partners can contribute expertise, speakers, venues, resources, technology, or funding.",
    items: [
      "Brand-sponsored events",
      "Workshops and masterclasses",
      "Guest lectures and industry panels",
      "Networking events and career fairs",
      "Brand challenges and marketing competitions",
      "Case studies and industry research",
      "Thought leadership",
      "Tool education and community activations",
    ],
    bestFor: "Brands and professionals who want to engage directly with the marketing community.",
    href: "/contact#message",
    cta: "Explore a collaboration",
    formType: "Collaboration",
  },
  {
    id: "sponsor",
    n: "04",
    kicker: "Sponsor the next generation",
    title: "Invest in access. Invest in opportunity.",
    body: "Help create more opportunities for aspiring and emerging marketers who may not otherwise have access to quality training, mentorship, professional networks, and industry experience. Your organisation can help someone move from learning marketing to building a career in it.",
    items: [
      "Scholarships",
      "Training programmes",
      "Community initiatives",
      "Events and mentorship programmes",
      "Learning resources",
      "Marketing competitions",
      "Career development initiatives",
      "Student access",
    ],
    bestFor: "Organisations looking to support marketing talent development and create meaningful social impact.",
    href: "/contact#message",
    cta: "Become a sponsor",
    formType: "Sponsorship",
  },
] as const;

export const trainingAudience = [
  "Aspiring social media managers",
  "Students and graduates",
  "Freelancers",
  "Creators moving into marketing",
  "Early-career marketers",
  "Existing social media professionals",
];

export const experienceOpportunities = [
  "Volunteer",
  "Intern",
  "Support real projects",
  "Build their portfolios",
  "Gain professional experience",
  "Develop industry relationships",
];

export const experienceReview = [
  "What the participant worked on",
  "What they learned",
  "Portfolio deliverables completed",
  "Skills developed",
  "Mentor feedback",
  "Areas for continued development",
];

export const menteeTopics = [
  "Career decisions",
  "Marketing skills",
  "Portfolio development",
  "Personal branding",
  "Freelancing",
  "Professional development",
  "Navigating the marketing industry",
];

export const resourceOfferings = [
  "Content calendars",
  "Marketing templates",
  "Strategy frameworks",
  "Checklists",
  "AI prompts",
  "Guides",
  "Worksheets",
  "Career resources",
];

export const insightTopics = [
  { title: "Social Media", body: "Strategies, platforms, and content." },
  { title: "Marketing Strategy", body: "How marketers approach business problems." },
  { title: "AI", body: "How AI is changing marketing work." },
  { title: "Careers", body: "Skills, portfolios, and professional development." },
  { title: "Industry", body: "Trends, shifts, and lessons from the marketing industry." },
  { title: "Case Studies", body: "What brands and marketers can learn from real campaigns." },
];
