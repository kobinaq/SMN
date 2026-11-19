/**
 * Programs hub and the three program pages.
 * Duration, fees, dates, curriculum and certificate rules are omitted:
 * the document says to add them only once TSA confirms them.
 */

export const programsSeo = {
  title: "Social Media Marketing Programs & Training | Think Social Academy",
  description:
    "Explore social media marketing training at Think Social Academy, including the core program, specialised one-on-one training and tailored organisational programs.",
} as const;

export const programsHero = {
  title: "Find the right learning experience for your next step.",
  lede: "Whether you are starting out, developing specialised skills or equipping your team, Think Social Academy offers practical learning experiences built around real-world application.",
  ctaLabel: "Explore our programs",
  ctaHref: "#programs",
} as const;

export type ProgramSection = {
  heading: string;
  items?: readonly string[];
  body?: string;
};

export type ProgramKind = "cohort" | "one-on-one" | "workshop";

export type ProgramCopy = {
  kind: ProgramKind;
  id: string;
  href: string;
  descriptor: string;
  title: string;
  subheading?: string;
  paragraphs: readonly string[];
  sections: readonly ProgramSection[];
  ctaLabel: string;
};

export const socialMediaProgram: ProgramCopy = {
  kind: "cohort",
  id: "social-media-marketing",
  href: "/programs/social-media-marketing",
  descriptor: "Structured • Practical • Cohort-based",
  title: "Social Media Marketing Program",
  subheading: "Programme 1: Social Media Marketing Programme",
  paragraphs: [
    "Build the skills to plan, manage and deliver results for any brand or business.",
    "This structured learning programme equips beginners, aspiring professionals, practising social media marketers and business owners with the strategic and practical skills required to understand, plan and manage brands effectively.",
  ],
  sections: [
    {
      heading: "Who it's for",
      items: [
        "Beginners looking to build a strong foundation in social media marketing.",
        "Students and graduates preparing to pursue opportunities in the field.",
        "Practising social media marketers looking to strengthen their approach.",
        "Business owners who want to understand and apply social media marketing to their businesses.",
      ],
    },
    {
      heading: "What you'll develop",
      items: [
        "An understanding of social media marketing and its role in business.",
        "The ability to understand marketing objectives and translate them into social media strategies.",
        "Audience research and platform selection skills.",
        "Content planning and development skills.",
        "Social media page management and execution.",
        "Campaign planning and implementation.",
        "Performance measurement, reporting and evaluation.",
        "The ability to use relevant digital and AI tools to improve your workflow.",
      ],
    },
    {
      heading: "What you leave with",
      items: ["A certificate", "A portfolio template with your work"],
    },
  ],
  ctaLabel: "View program details / Register interest",
};

export const oneOnOneProgram: ProgramCopy = {
  kind: "one-on-one",
  id: "one-on-one-training",
  href: "/programs/one-on-one-training",
  descriptor: "Personalised • Focused • Flexible",
  title: "Specialised One-on-One Training",
  paragraphs: [
    "Not every learning need fits a cohort program. Our specialised one-on-one training is designed around your goals, experience and specific development needs. Together, we identify the skills you want to strengthen and shape a focused learning experience around them.",
  ],
  sections: [
    {
      heading: "Who it is for",
      items: [
        "Individuals transitioning into social media marketing,",
        "Professionals who want to strengthen specific areas of their practice.",
        "Business owners who need guidance on applying social media marketing to their businesses.",
        "Individuals who prefer a more focused and flexible learning experience.",
      ],
    },
    {
      heading: "What you will develop",
      items: [
        "A learning experience tailored to your objectives.",
        "Focused instruction based on your existing knowledge and skill level.",
        "Practical exercises and guided application.",
      ],
    },
    {
      heading: "What you leave with",
      items: ["A certificate", "A 30- day content calendar", "Mentorship for your next opportunity"],
    },
    {
      heading: "What you'll leave with",
      items: [
        "Practical skills relevant to your role, industry and objectives.",
        "Industry-specific social media strategies tailored to your business or organizational needs.",
        "Platform knowledge and the ability to use relevant social media platforms effectively.",
        "Practical resources including templates, guides, kits and implementation materials to support continued application.",
      ],
    },
  ],
  ctaLabel: "Enquire about one-on-one training",
};

export const workshopProgram: ProgramCopy = {
  kind: "workshop",
  id: "organisational-training",
  href: "/programs/organisational-training",
  descriptor: "Tailored • Practical • Team-focused",
  title: "Organisational Training",
  paragraphs: [
    "Our specialised workshops are hands-on, instructor-led training experiences developed for teams, groups, business owners in specific industries, communities or organisations.",
    "Each workshop is designed around the audience's learning needs, objectives and context. Participants receive focused instruction, practical guidance and opportunities to apply what they learn with an instructor supporting the learning process.",
    "A workshop could be designed for schools, business owners in a particular industry, women entrepreneurs, fashion students, professional groups, teams or institutions looking to develop specific social media marketing skills.",
  ],
  sections: [
    {
      heading: "Who it's for",
      items: [
        "Business owners and entrepreneurs.",
        "Professional and industry groups.",
        "Students and learning communities.",
        "Teams and organisations.",
        "Institutions and development initiatives.",
      ],
    },
    {
      heading: "What you leave with",
      body: "A practical handbook tailored to your needs",
    },
  ],
  ctaLabel: "Discuss organisational training",
};

export const programs = [socialMediaProgram, oneOnOneProgram, workshopProgram] as const;

export const whyLearn = {
  title: "Why learn with TSA?",
  items: [
    "Learning designed for the African context informed by global developments.",
    "Practical learning connected to real marketing tasks.",
    "Strategy-led thinking rather than disconnected content tips.",
    "Responsible use of AI and relevant digital tools to help you create content faster",
    "Guidance and feedback within structured learning experiences.",
  ],
} as const;

export const programFaqs = [
  {
    question: "Do I need prior experience to join?",
    answer:
      "The Social Media Marketing Program is designed to accommodate beginners. Requirements for specialised and organisational training depend on the learning brief.",
  },
  {
    question: "Are the programs delivered online or in person?",
    answer:
      "Delivery format depends on the program and cohort. Confirm the current format on the relevant program details page.",
  },
  {
    question: "How long does training take?",
    answer:
      "Duration varies by program and training requirements. Refer to the relevant program details or contact TSA.",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Certificate availability and completion requirements should be stated on each program page once confirmed by TSA.",
  },
  {
    question: "How do I enrol or enquire?",
    answer:
      "Use the relevant program call to action to register interest or submit an enquiry. TSA will provide the next steps.",
  },
] as const;

export const programsClose = {
  title: "Ready to build skills that move you forward?",
  body: "Explore a program or speak with us about the right learning experience for you or your team.",
  ctaLabel: "Get started",
  ctaHref: "/contact",
} as const;
