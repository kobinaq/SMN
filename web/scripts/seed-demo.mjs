import "dotenv/config";
import { getPayload } from "payload";
import config from "./.payload.config.bundle.mjs";

if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
  throw new Error("Refusing to seed production without ALLOW_PRODUCTION_SEED=true.");
}

// Local/E2E SQLite needs an explicit schema push now that connect no longer auto-pushes.
if (process.env.PAYLOAD_DB_PUSH !== "false") {
  process.env.PAYLOAD_DB_PUSH = "true";
}

const payload = await getPayload({ config });
const now = new Date();
const future = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 45).toISOString();

async function first(collection, where) {
  const result = await payload.find({ collection, where, limit: 1, depth: 0, overrideAccess: true });
  return result.docs[0];
}

async function upsert(collection, where, data) {
  const existing = await first(collection, where);
  if (existing) {
    return payload.update({ collection, id: existing.id, data, overrideAccess: true });
  }
  return payload.create({ collection, data, overrideAccess: true });
}

const staff = await upsert(
  "users",
  { email: { equals: "staff.demo@smn.example" } },
  { email: "staff.demo@smn.example", password: "DemoStaff123!", name: "SMN Demo Staff" },
);

const ama = await upsert(
  "members",
  { email: { equals: "ama.demo@smn.example" } },
  {
    email: "ama.demo@smn.example",
    password: "DemoMember123!",
    name: "Ama Mensah",
    handle: "ama-mensah-demo",
    headline: "Junior social media strategist",
    bio: "Fictional demo member building practical campaign and portfolio skills.",
    location: "Accra, Ghana",
    visibility: "public",
    roles: ["member"],
    cohortStatus: "active",
  },
);

const kojo = await upsert(
  "members",
  { email: { equals: "kojo.demo@smn.example" } },
  {
    email: "kojo.demo@smn.example",
    password: "DemoMember123!",
    name: "Kojo Boateng",
    handle: "kojo-boateng-demo",
    headline: "Growth marketing lead",
    bio: "Fictional mentor profile for demo and QA workflows.",
    location: "Kumasi, Ghana",
    visibility: "members",
    roles: ["member", "mentor"],
    cohortStatus: "completed",
  },
);

const mentor = await upsert(
  "mentors",
  { member: { equals: kojo.id } },
  {
    member: kojo.id,
    title: "Growth marketing and portfolio mentor",
    bio: "I help early-career marketers turn campaign work into measurable stories and stronger interviews. This is fictional demo data.",
    topics: ["Growth marketing", "Portfolio reviews", "Career development"],
    seniority: "Lead / Head",
    availability: "Available",
    bookingUrl: "https://cal.com/example/demo",
    status: "draft",
    featured: true,
    approvedAt: now.toISOString(),
    approvedBy: staff.id,
  },
);

await upsert(
  "mentorship-requests",
  { and: [{ requester: { equals: ama.id } }, { mentor: { equals: mentor.id } }] },
  {
    requester: ama.id,
    mentor: mentor.id,
    topic: "Portfolio reviews",
    goal: "Improve my campaign case study",
    message: "I would like feedback on how to show strategy, results, and lessons learned in my portfolio.",
    preferredFormat: "Portfolio review",
    status: "reviewing",
  },
);

const opportunity = await upsert(
  "opportunities",
  { slug: { equals: "demo-social-media-associate" } },
  {
    title: "Social Media Associate",
    slug: "demo-social-media-associate",
    company: "Bright Coast Studio",
    summary: "A fictional entry-level role for testing opportunity workflows.",
    description: "Support content planning, reporting, and community management for a growing consumer brand.",
    type: "Full-time",
    workMode: "Hybrid",
    experienceLevel: "Entry level",
    location: "Accra, Ghana",
    salary: "GHS 4,000 - 5,500",
    applicationUrl: "https://example.com/jobs/social-media-associate",
    sourceLabel: "manual",
    status: "pending",
    expiresAt: future,
  },
);

const enrollment = await upsert(
  "opportunity-applications",
  { and: [{ member: { equals: ama.id } }, { opportunity: { equals: opportunity.id } }] },
  { member: ama.id, opportunity: opportunity.id, status: "applied", appliedAt: now.toISOString() },
);

await upsert(
  "enrollments",
  { and: [{ member: { equals: ama.id } }, { programKey: { equals: "demo-cohort" } }] },
  {
    member: ama.id,
    programName: "Demo Marketing Cohort",
    programKey: "demo-cohort",
    programType: "Cohort",
    source: "staff",
    status: "completed",
    completionPercent: 100,
    certificateEligible: true,
    completedAt: now.toISOString(),
    classroomUrl: "https://classroom.google.com/example",
    courseUrl: "https://selar.co/example",
    startsAt: now.toISOString(),
    endsAt: future,
  },
);

const course = await upsert(
  "lms-courses",
  { slug: { equals: "demo-content-strategy" } },
  {
    title: "Demo Content Strategy Sprint",
    slug: "demo-content-strategy",
    summary: "A fictional LMS course for testing course access, lessons, and progress.",
    instructor: "Arielle Adodo",
    category: "Content strategy",
    prerequisites: "None",
    learningOutcomes: [{ outcome: "Create a focused content strategy before building a calendar." }],
    programKey: "demo-cohort",
    accessRule: "enrolled",
    level: "foundation",
    estimatedHours: 3,
    order: 1,
    status: "draft",
    tutorEnabled: true,
  },
);

const courseModule = await upsert(
  "lms-modules",
  { slug: { equals: "demo-content-foundations" } },
  {
    course: course.id,
    title: "Content foundations",
    slug: "demo-content-foundations",
    summary: "Set the strategy before publishing.",
    order: 1,
    status: "published",
  },
);

const lesson = await upsert(
  "lms-lessons",
  { slug: { equals: "demo-strategy-before-calendar" } },
  {
    course: course.id,
    module: courseModule.id,
    title: "Strategy before the calendar",
    slug: "demo-strategy-before-calendar",
    summary: "A fictional unlisted YouTube lesson used for demo testing.",
    lessonType: "video",
    youtubeUrl: "https://youtu.be/dQw4w9WgXcQ",
    durationMinutes: 12,
    body: "Define the audience, promise, and weekly content decisions before filling a calendar.",
    order: 1,
    status: "published",
  },
);

await payload.update({
  collection: "lms-courses",
  id: course.id,
  data: { status: "published" },
  overrideAccess: true,
});

await upsert(
  "lms-lesson-progress",
  { and: [{ member: { equals: ama.id } }, { lesson: { equals: lesson.id } }] },
  { member: ama.id, course: course.id, lesson: lesson.id, status: "in-progress" },
);

await upsert(
  "portfolios",
  { slug: { equals: "demo-ama-campaign-refresh" } },
  {
    member: ama.id,
    title: "Campaign refresh for a local skincare brand",
    slug: "demo-ama-campaign-refresh",
    summary: "Fictional demo case study for the public portfolio flow.",
    challenge: "The brand needed clearer positioning and a practical content rhythm.",
    approach: "Ama mapped audience segments, clarified content pillars, and rebuilt the weekly calendar.",
    outcome: "The fictional campaign improved consistency and gave the team a clearer reporting structure.",
    skills: [{ skill: "Content strategy" }, { skill: "Reporting" }],
    status: "published",
    visibility: "public",
    featured: true,
    order: 1,
  },
);

await upsert(
  "certificates",
  { credentialCode: { equals: "SMN-DEMO-001" } },
  {
    member: ama.id,
    course: course.id,
    enrollment: enrollment.id,
    issuedBy: staff.id,
    title: "Content Strategy Sprint Completion",
    programName: "Demo Marketing Cohort",
    programKey: "demo-cohort",
    credentialCode: "SMN-DEMO-001",
    activeIssuanceKey: `${ama.id}:demo-cohort`,
    summary: "Issued for completing the fictional demo course.",
    skills: [{ skill: "Content strategy" }],
    issuedAt: now.toISOString(),
    status: "valid",
    visibility: "public",
  },
);

await upsert(
  "events",
  { slug: { equals: "demo-portfolio-clinic" } },
  {
    title: "Demo Portfolio Clinic",
    slug: "demo-portfolio-clinic",
    type: "Workshop",
    date: future,
    time: "6:00 PM GMT",
    summary: "A fictional event for testing public event pages.",
    registrationUrl: "https://example.com/events/demo-portfolio-clinic",
  },
);

await upsert(
  "resources",
  { slug: { equals: "demo-campaign-brief" } },
  {
    title: "Demo Campaign Brief",
    slug: "demo-campaign-brief",
    type: "Template",
    description: "A fictional downloadable resource entry for QA.",
  },
);

await upsert(
  "posts",
  { slug: { equals: "demo-strategy-before-content" } },
  {
    title: "Strategy before content",
    slug: "demo-strategy-before-content",
    category: "Marketing Strategy",
    excerpt: "A fictional post used to verify CMS-backed insights.",
    publishedAt: now.toISOString(),
    readTime: "4 min",
  },
);

await upsert(
  "stories",
  { name: { equals: "Efua Demo" } },
  {
    name: "Efua Demo",
    role: "Fictional alumna",
    quote: "SMN helped me explain my work with more clarity.",
    published: false,
    permissionConfirmed: false,
  },
);

payload.logger.info("Demo seed complete. Fictional accounts use *@smn.example emails.");
process.exit(0);
