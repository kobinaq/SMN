/**
 * Copy for the Join TSA flow: /signup, /signup/confirmed and the first-run
 * screens in the member portal (/app/welcome and the member home welcome).
 *
 * Tab 4 sets the structure (Join TSA leads to account creation and the member
 * dashboard). Tab 5 wins on wording: the community is opt-in updates, not a
 * WhatsApp group or a network, and nothing promises jobs, clients or income.
 * Cohort facts (name, duration) are passed in from site settings so they stay
 * in step with lib/site.ts and the CMS.
 */

export type JoinCohortFacts = {
  name: string;
  duration: string;
};

/** Secondary WhatsApp link. Never the primary Join TSA action. */
export const whatsappUpdatesLabel = "Also get TSA updates on WhatsApp";

export const signupCopy = {
  metaTitle: "Create account",
  metaDescription:
    "Join Think Social Academy. Create your free TSA account to learn, practise and stay connected.",
  title: "Join TSA",
  subtitle:
    "Create your free TSA account. It is your home for learning, practical work and TSA updates.",
  requiredNote: "All fields are required.",
  submitLabel: "Create free account",
  submittingLabel: "Creating your account…",
  signInPrompt: "Already have an account?",
  signInLabel: "Sign in",
  includesHeading: "What your free account includes",
  fields: {
    name: { label: "Full name", autoComplete: "name" },
    email: { label: "Email", hint: "We use this to sign you in. We will not share it." },
    password: { label: "Password", hint: "At least 8 characters." },
    confirm: { label: "Confirm password" },
  },
  errors: {
    name: "Enter your full name.",
    email: "Enter a valid email address, like name@example.com.",
    password: "Use at least 8 characters for your password.",
    passwordTooLong: "Use 200 characters or fewer for your password.",
    confirm: "The passwords do not match.",
    summary: "Check the highlighted fields and try again.",
    server:
      "We could not create your account. If you already have one, sign in or reset your password.",
    network: "We could not reach TSA. Check your connection and try again.",
  },
} as const;

/** Learn. Apply. Grow. Connect. as it applies to a free member account. */
export const accountIncludes = [
  {
    title: "Learn",
    body: "Explore courses and programme materials in the member portal.",
  },
  {
    title: "Apply",
    body: "Practise with guided briefs, exercises and clearly labelled simulations, depending on your programme.",
  },
  {
    title: "Grow",
    body: "Build portfolio work, track your progress and get guidance from tutors and mentors.",
  },
  {
    title: "Connect",
    body: "Get TSA updates and early notice of selected events and learning experiences when available.",
  },
] as const;

export function cohortNote(cohort: JoinCohortFacts) {
  return `The ${cohort.name} runs for ${cohort.duration}. Your free account comes first. Cohort places are a separate application.`;
}

export const confirmationCopy = {
  metaTitle: "Account created",
  title: "Your TSA account is ready",
  nextHeading: "What happens next",
  primaryLabel: "Start your first steps",
  secondaryLabel: "Go to member home",
} as const;

export function confirmationSubtitle(name: string, email: string) {
  return `Welcome, ${name}. You are signed in as ${email}.`;
}

export function confirmationSteps(cohort: JoinCohortFacts) {
  return [
    "Take a quick look at what you can do as a TSA member.",
    "Complete your profile essentials so tutors and mentors know where you are starting from.",
    `When you are ready, apply for the ${cohort.name} (${cohort.duration}).`,
  ];
}

export const firstRunCopy = {
  metaTitle: "Welcome",
  eyebrow: "Getting started",
  intro:
    "Here is what you can do now that you are a member. Start anywhere. Your member home keeps track of what is next.",
  areasHeading: "What you can do now",
  cohortEyebrow: "Programme",
  profileHeading: "Start with your profile",
  profileBody: "A few details help tutors and mentors understand your goals and where you are starting from.",
  profileLabel: "Complete your profile",
  homeLabel: "Go to member home",
} as const;

export function firstRunTitle(name: string) {
  return `Welcome to TSA, ${name}.`;
}

export const firstRunAreas = [
  {
    key: "learn",
    title: "Learn",
    body: "Work through courses and programme materials at your own pace.",
    href: "/app/learning",
    cta: "Open Learning",
  },
  {
    key: "apply",
    title: "Apply",
    body: "Practise on guided briefs and clearly labelled simulations, then keep the work in your portfolio.",
    href: "/app/portfolio",
    cta: "Open Portfolio",
  },
  {
    key: "grow",
    title: "Grow",
    body: "Get guidance from tutors and mentors as you explore your strengths and next step.",
    href: "/app/mentors",
    cta: "Meet the mentors",
  },
  {
    key: "connect",
    title: "Connect",
    body: "See upcoming TSA events and sessions. Members may get early notice of selected events when available.",
    href: "/app/events",
    cta: "See events",
  },
] as const;

export function firstRunCohortTitle(cohort: JoinCohortFacts) {
  return `${cohort.name}: ${cohort.duration}`;
}

export function firstRunCohortBody(cohort: JoinCohortFacts) {
  return `Your free account gives you the member portal. The cohort runs for ${cohort.duration} and is a separate application. Its lessons appear in Learning once your place is confirmed.`;
}

export const memberHomeCopy = {
  intro:
    "Here is what you can do now that you are a member: keep learning, put your skills to work and stay connected to TSA.",
  firstStepsLink: "New here? See what you can do as a member",
} as const;

export function memberHomeTitle(name: string) {
  return `Welcome, ${name}.`;
}
