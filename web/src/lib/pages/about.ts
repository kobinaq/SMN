/**
 * About page copy (ticket T10).
 *
 * Source: Tab 4 "06 About", adjusted to the Tab 5 brand rules where they
 * conflict (Tab 5 wins). Kept in its own module so the page rebuilds do not
 * collide with the home rebuild's edits to lib/content.ts.
 */

export const aboutHero = {
  kicker: "About Think Social Academy",
  title: "We believe people should learn how to think, not just what to post.",
  lede: "Think Social Academy (TSA) is a social media marketing academy and community. We help people learn social media marketing, practise through guided work, and develop a more purposeful approach to driving results for brands.",
} as const;

/** Tab 4 "About TSA": origin and purpose. */
export const aboutOrigin = {
  kicker: "Why TSA exists",
  title: "Closing the gap between knowing and doing.",
  paragraphs: [
    "TSA was created to address the gap between learning marketing concepts and knowing how to apply them in the real world, especially for brands and audiences in Ghana and across Africa.",
    "Social media has grown from simply posting content into an important part of how businesses build brands, communities and revenue. At the same time, AI is changing how marketers research, plan and work.",
    "Yet learning marketing is still often fragmented. People learn a tool here, a platform there, and a few content tricks without understanding how it all connects. TSA connects strategy, platforms, AI and practical application so learners can make purposeful marketing decisions and put them into practice.",
  ],
} as const;

/** Tab 4 mission and vision. Mission drops "confidence" as the central promise (Tab 5). */
export const aboutMission =
  "Help people build the knowledge, skills and practical experience to use social media effectively and work towards results for brands and organisations.";

export const aboutVision =
  "To build a growing community of thinkers and doers who keep learning, keep applying and help the next person find their next step.";

/** Tab 4 "Why choose TSA", adjusted to Tab 5 claims. */
export const aboutWhyChoose: { title: string; body: string }[] = [
  {
    title: "Strategy over tricks",
    body: "We teach the thinking behind effective social media marketing, not just trends and tactics.",
  },
  {
    title: "Practice over passive learning",
    body: "You don't just consume information. You apply it through exercises, guided briefs and clearly labelled simulations.",
  },
  {
    title: "Guided learning",
    body: "You have access to instructors and guidance throughout your programme.",
  },
  {
    title: "AI-powered workflows",
    body: "AI is part of the learning process as a tool to help you research, think, plan and execute. You stay responsible for quality, context and the final decision.",
  },
  {
    title: "Different business contexts",
    body: "Practise connecting social media work to business objectives across different brands, industries and audiences.",
  },
  {
    title: "Continuous growth",
    body: "Your learning doesn't have to end when your programme ends. The TSA community keeps you connected to updates and selected learning experiences.",
  },
];

/** Tab 4 "Our learning philosophy", expanded with the Tab 5 framework definitions. */
export const aboutPhilosophy: { title: string; body: string }[] = [
  {
    title: "Learn",
    body: "Understand the principles and purpose behind social media marketing through clear instruction and practical lessons.",
  },
  {
    title: "Apply",
    body: "Practise through exercises, guided briefs, clearly labelled simulations and portfolio work.",
  },
  {
    title: "Grow",
    body: "Develop through feedback, reflection, repeated practice and exploration of different markets and audiences.",
  },
  {
    title: "Connect",
    body: "Stay connected to TSA updates, learning experiences, selected partnerships, opportunities and events as they become available.",
  },
];

/**
 * Expanded founder story (Tab 4 "Founder"). Facts come from the existing
 * founderStory in lib/content.ts, reworded for TSA and without career or
 * placement promises (Tab 5).
 */
export const aboutFounder = {
  kicker: "Meet the founder",
  name: "Arielle Adodo",
  role: "Founder, Think Social Academy",
  // TODO(placeholder): Tab 4 asks for a name/signature treatment. No signature asset exists yet.
  story: [
    "I didn't start in marketing. I had to figure my way into it.",
    "I didn't have a traditional marketing degree or a clear roadmap telling me what to learn next. I started with social media and content, learning through experience, experimenting, working with brands, and gradually figuring out that there was much more to marketing than making good-looking content.",
    "Over the years, I worked across social media, content and digital marketing, with experience spanning FMCG, lifestyle, consumer and technology brands. The more I worked in the industry, the more I noticed a problem: social media marketing was evolving, and the way we were teaching it wasn't.",
    "Social media managers were no longer just being asked to keep a page active or create good-looking content. Brands wanted people who could understand the audience, develop strategy, contribute to campaigns and help drive results. Yet many people entering the field were learning how to post before they learned how to think.",
    "There was also very little guidance on the practical side: how to build a portfolio, how to understand the business behind a brief, how to explain your thinking, and what to learn to stay relevant as AI changes the work.",
    "I spent years figuring that out myself. That's why I founded Think Social Academy: to connect social media strategy, AI and practical application, and to build a community of thinkers and doers that keeps learning and helps the next person find their next step.",
  ],
  experience: [
    "Social and digital marketing across FMCG, lifestyle, consumer and technology brands",
    "Content strategy, brand storytelling and marketing education",
    "Leads the Social Media Marketing & AI programme at TSA",
  ],
} as const;

/** Tab 4 "The Think Social ecosystem". Tab 5: the Agency is separate, not an Academy programme. */
export const aboutEcosystem: { title: string; tagline: string; body: string; href: string; ctaLabel: string }[] = [
  {
    title: "Think Social Academy",
    tagline: "Academy + Community",
    body: "Learning, practical application, professional development and a community that keeps you connected.",
    href: "/academy",
    ctaLabel: "Explore the Academy",
  },
  {
    title: "Think Social Agency",
    tagline: "Social Media, Storytelling & Content",
    body: "A separate agency arm serving brands and organisations. It is not an Academy programme.",
    href: "/partner#agency",
    ctaLabel: "About the agency",
  },
];

export const aboutClose = {
  kicker: "Think beyond posting",
  title: "Learn. Apply. Grow. Connect.",
  lede: "Explore the programmes, or create a free TSA account to stay connected to updates, learning experiences and events.",
} as const;
