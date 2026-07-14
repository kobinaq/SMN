import type { Payload } from "payload";
import { canStaff, staffRole, type StaffRole } from "@/lib/staff-permissions";
import { evaluateCourseReadiness } from "@/lib/lms-readiness";

export type AttentionTone = "mint" | "amber" | "violet" | "red" | "blue";

export type AttentionItem = {
  key: string;
  label: string;
  detail: string;
  value: number;
  href: string;
  tone: AttentionTone;
  oldestDays?: number;
  roles: StaffRole[];
};

export type WorkspaceBadge = {
  href: string;
  label: string;
  count: number;
  roles: StaffRole[];
};

type Access = { overrideAccess: false; user: unknown };

function daysWaiting(iso?: string | null) {
  if (!iso) return undefined;
  return Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86_400_000));
}

function ageLabel(days?: number) {
  if (days === undefined) return "";
  if (days <= 0) return "Arrived today";
  if (days === 1) return "Oldest waiting 1 day";
  return `Oldest waiting ${days} days`;
}

export async function getAdminWorkspaceBadges(payload: Payload, user: unknown) {
  const access = { overrideAccess: false, user } as Access;
  const now = new Date().toISOString();
  const soon = new Date(Date.now() + 14 * 86_400_000).toISOString();
  const [
    pendingMentors,
    mentorshipRequests,
    pendingOpportunities,
    expiringOpportunities,
    failedSources,
    draftCourses,
    incompleteish,
    eligibleEnrollments,
    validCertificates,
  ] = await Promise.all([
    payload.count({ collection: "mentors", where: { status: { equals: "draft" } }, ...access }),
    payload.count({ collection: "mentorship-requests", where: { status: { in: ["new", "reviewing"] } }, ...access }),
    payload.count({ collection: "opportunities", where: { status: { equals: "pending" } }, ...access }),
    payload.count({
      collection: "opportunities",
      where: {
        and: [
          { status: { equals: "published" } },
          { expiresAt: { greater_than_equal: now } },
          { expiresAt: { less_than_equal: soon } },
        ],
      },
      ...access,
    }),
    payload.count({ collection: "opportunity-sources", where: { lastError: { exists: true } }, ...access }),
    payload.count({ collection: "lms-courses", where: { status: { equals: "draft" } }, ...access }),
    payload.count({ collection: "lms-courses", where: { status: { equals: "published" } }, ...access }),
    payload.count({
      collection: "enrollments",
      where: { and: [{ status: { equals: "completed" } }, { certificateEligible: { equals: true } }] },
      ...access,
    }),
    payload.count({ collection: "certificates", where: { status: { equals: "valid" } }, ...access }),
  ]);

  const certificateBacklog = Math.max(0, eligibleEnrollments.totalDocs - validCertificates.totalDocs);
  const courseQueue = draftCourses.totalDocs + Math.min(incompleteish.totalDocs, draftCourses.totalDocs);
  const overview =
    pendingMentors.totalDocs +
    mentorshipRequests.totalDocs +
    pendingOpportunities.totalDocs +
    expiringOpportunities.totalDocs +
    failedSources.totalDocs +
    draftCourses.totalDocs +
    certificateBacklog;

  const workspaces: WorkspaceBadge[] = [
    { href: "/staff", label: "Overview", count: overview, roles: staffRolesAll() },
    { href: "/staff/learning", label: "Course Builder", count: courseQueue, roles: roles("super-admin", "learning", "content", "support") },
    { href: "/staff/members", label: "Member 360", count: 0, roles: roles("super-admin", "support", "mentorship", "learning", "analyst") },
    { href: "/staff/mentorship", label: "Mentorship", count: pendingMentors.totalDocs + mentorshipRequests.totalDocs, roles: roles("super-admin", "mentorship", "support") },
    { href: "/staff/opportunities", label: "Opportunities", count: pendingOpportunities.totalDocs + expiringOpportunities.totalDocs + failedSources.totalDocs, roles: roles("super-admin", "opportunity", "support", "analyst") },
    { href: "/staff/certificates", label: "Certificates", count: certificateBacklog, roles: roles("super-admin", "learning", "support") },
  ].filter((item) => canStaff(user as never, ...item.roles) || staffRole(user as never) === "analyst");

  return workspaces;
}

export async function getAdminOpsSnapshot(payload: Payload, user: unknown) {
  const access = { overrideAccess: false, user } as Access;
  const now = new Date().toISOString();
  const soon = new Date(Date.now() + 14 * 86_400_000).toISOString();
  const activeSince = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [
    members,
    newMembers,
    recentlyActiveMembers,
    enrollments,
    completedEnrollments,
    activeLearners,
    pendingMentors,
    oldestMentor,
    mentorshipRequests,
    oldestRequest,
    activeMentorships,
    pendingOpportunities,
    oldestPendingOpportunity,
    publishedOpportunities,
    opportunityApplications,
    expiringOpportunities,
    oldestExpiring,
    failedSources,
    draftCourses,
    courses,
    modules,
    lessons,
    certificates,
    eligibleEnrollments,
    validCertificates,
    auditEvents,
    sources,
  ] = await Promise.all([
    payload.count({ collection: "members", ...access }),
    payload.count({ collection: "members", where: { createdAt: { greater_than_equal: monthStart } }, ...access }),
    payload.count({ collection: "members", where: { updatedAt: { greater_than_equal: activeSince } }, ...access }),
    payload.count({ collection: "enrollments", ...access }),
    payload.count({ collection: "enrollments", where: { status: { equals: "completed" } }, ...access }),
    payload.count({ collection: "lms-lesson-progress", where: { updatedAt: { greater_than_equal: activeSince } }, ...access }),
    payload.count({ collection: "mentors", where: { status: { equals: "draft" } }, ...access }),
    payload.find({ collection: "mentors", limit: 1, depth: 0, sort: "createdAt", where: { status: { equals: "draft" } }, ...access }),
    payload.count({ collection: "mentorship-requests", where: { status: { in: ["new", "reviewing"] } }, ...access }),
    payload.find({ collection: "mentorship-requests", limit: 1, depth: 0, sort: "createdAt", where: { status: { in: ["new", "reviewing"] } }, ...access }),
    payload.count({ collection: "mentorship-requests", where: { status: { equals: "introduced" } }, ...access }),
    payload.count({ collection: "opportunities", where: { status: { equals: "pending" } }, ...access }),
    payload.find({ collection: "opportunities", limit: 1, depth: 0, sort: "createdAt", where: { status: { equals: "pending" } }, ...access }),
    payload.count({ collection: "opportunities", where: { status: { equals: "published" } }, ...access }),
    payload.count({ collection: "opportunity-applications", ...access }),
    payload.count({
      collection: "opportunities",
      where: {
        and: [
          { status: { equals: "published" } },
          { expiresAt: { greater_than_equal: now } },
          { expiresAt: { less_than_equal: soon } },
        ],
      },
      ...access,
    }),
    payload.find({
      collection: "opportunities",
      limit: 1,
      depth: 0,
      sort: "expiresAt",
      where: {
        and: [
          { status: { equals: "published" } },
          { expiresAt: { greater_than_equal: now } },
          { expiresAt: { less_than_equal: soon } },
        ],
      },
      ...access,
    }),
    payload.count({ collection: "opportunity-sources", where: { lastError: { exists: true } }, ...access }),
    payload.count({ collection: "lms-courses", where: { status: { equals: "draft" } }, ...access }),
    payload.find({ collection: "lms-courses", limit: 100, depth: 0, sort: "-updatedAt", ...access }),
    payload.find({ collection: "lms-modules", limit: 500, depth: 0, ...access }),
    payload.find({ collection: "lms-lessons", limit: 1000, depth: 0, ...access }),
    payload.count({ collection: "certificates", where: { status: { equals: "valid" } }, ...access }),
    payload.find({
      collection: "enrollments",
      limit: 500,
      depth: 0,
      where: { and: [{ status: { equals: "completed" } }, { certificateEligible: { equals: true } }] },
      ...access,
    }),
    payload.find({ collection: "certificates", limit: 500, depth: 0, where: { status: { equals: "valid" } }, ...access }),
    payload.find({ collection: "audit-events", limit: 12, depth: 1, sort: "-createdAt", ...access }),
    payload.find({ collection: "opportunity-sources", limit: 50, depth: 0, sort: "-lastSyncedAt", ...access }),
  ]);

  const incompleteCourses = courses.docs.filter((course) => {
    const courseModules = modules.docs.filter((module) => {
      const courseId = typeof module.course === "object" ? module.course?.id : module.course;
      return String(courseId) === String(course.id);
    });
    const courseLessons = lessons.docs.filter((lesson) => {
      const courseId = typeof lesson.course === "object" ? lesson.course?.id : lesson.course;
      return String(courseId) === String(course.id);
    });
    return !evaluateCourseReadiness(course, courseModules, courseLessons).ready;
  }).length;

  const activeKeys = new Set(
    validCertificates.docs
      .map((item) => item.activeIssuanceKey)
      .filter((value): value is string => Boolean(value)),
  );
  const certificateBacklog = eligibleEnrollments.docs.filter((item) => {
    const memberId = typeof item.member === "object" ? item.member?.id : item.member;
    return !activeKeys.has(`${memberId}:${item.programKey}`);
  }).length;

  const attention: AttentionItem[] = [
    {
      key: "mentors",
      label: "Mentor applications",
      detail: [ageLabel(daysWaiting(oldestMentor.docs[0]?.createdAt)), "Awaiting staff review"].filter(Boolean).join(" · "),
      value: pendingMentors.totalDocs,
      href: "/staff/mentorship",
      tone: tone("mint"),
      oldestDays: daysWaiting(oldestMentor.docs[0]?.createdAt),
      roles: roles("super-admin", "mentorship", "support"),
    },
    {
      key: "mentorship-requests",
      label: "Mentorship requests",
      detail: [ageLabel(daysWaiting(oldestRequest.docs[0]?.createdAt)), "New or under review"].filter(Boolean).join(" · "),
      value: mentorshipRequests.totalDocs,
      href: "/staff/mentorship",
      tone: tone("violet"),
      oldestDays: daysWaiting(oldestRequest.docs[0]?.createdAt),
      roles: roles("super-admin", "mentorship", "support"),
    },
    {
      key: "opportunities",
      label: "Pending opportunities",
      detail: [ageLabel(daysWaiting(oldestPendingOpportunity.docs[0]?.createdAt)), "Awaiting publication"].filter(Boolean).join(" · "),
      value: pendingOpportunities.totalDocs,
      href: "/staff/opportunities",
      tone: tone("amber"),
      oldestDays: daysWaiting(oldestPendingOpportunity.docs[0]?.createdAt),
      roles: roles("super-admin", "opportunity", "support"),
    },
    {
      key: "expiring",
      label: "Expiring opportunities",
      detail: oldestExpiring.docs[0]?.expiresAt
        ? `Next expiry ${new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(oldestExpiring.docs[0].expiresAt))}`
        : "Closing in the next 14 days",
      value: expiringOpportunities.totalDocs,
      href: "/staff/opportunities",
      tone: tone("amber"),
      roles: roles("super-admin", "opportunity", "support"),
    },
    {
      key: "sources",
      label: "Source failures",
      detail: "Opportunity imports reporting errors",
      value: failedSources.totalDocs,
      href: "/staff/opportunities",
      tone: tone("red"),
      roles: roles("super-admin", "opportunity", "support", "analyst"),
    },
    {
      key: "courses",
      label: "Courses blocked",
      detail: "Failing publication readiness",
      value: incompleteCourses,
      href: "/staff/learning",
      tone: tone("blue"),
      roles: roles("super-admin", "learning", "content", "support"),
    },
    {
      key: "draft-courses",
      label: "Draft courses",
      detail: "Not yet published",
      value: draftCourses.totalDocs,
      href: "/staff/learning",
      tone: tone("blue"),
      roles: roles("super-admin", "learning", "content"),
    },
    {
      key: "certificates",
      label: "Certificates due",
      detail: "Eligible completions without a credential",
      value: certificateBacklog,
      href: "/staff/certificates",
      tone: tone("mint"),
      roles: roles("super-admin", "learning", "support"),
    },
  ].filter((item) => item.value > 0);

  const role = staffRole(user as { collection?: string; role?: StaffRole | null });
  const visibleAttention = attention
    .filter((item) => !role || role === "super-admin" || role === "analyst" || item.roles.includes(role))
    .sort((a, b) => (b.oldestDays || 0) - (a.oldestDays || 0) || b.value - a.value);

  const workspaces: WorkspaceBadge[] = [
    { href: "/staff", label: "Overview", count: visibleAttention.reduce((sum, item) => sum + item.value, 0), roles: staffRolesAll() },
    { href: "/staff/learning", label: "Course Builder", count: incompleteCourses + draftCourses.totalDocs, roles: roles("super-admin", "learning", "content", "support") },
    { href: "/staff/members", label: "Member 360", count: 0, roles: roles("super-admin", "support", "mentorship", "learning", "analyst") },
    { href: "/staff/mentorship", label: "Mentorship", count: pendingMentors.totalDocs + mentorshipRequests.totalDocs, roles: roles("super-admin", "mentorship", "support") },
    { href: "/staff/opportunities", label: "Opportunities", count: pendingOpportunities.totalDocs + expiringOpportunities.totalDocs + failedSources.totalDocs, roles: roles("super-admin", "opportunity", "support", "analyst") },
    { href: "/staff/certificates", label: "Certificates", count: certificateBacklog, roles: roles("super-admin", "learning", "support") },
  ].filter((item) => canStaff(user as never, ...item.roles) || role === "analyst");

  const completionRate = enrollments.totalDocs
    ? Math.round((completedEnrollments.totalDocs / enrollments.totalDocs) * 100)
    : 0;

  const lastSourceSync = sources.docs
    .map((item) => item.lastSyncedAt)
    .filter(Boolean)
    .sort((a, b) => Date.parse(String(b)) - Date.parse(String(a)))[0];

  return {
    role,
    attention: visibleAttention,
    workspaces,
    metrics: [
      { label: "Total members", value: members.totalDocs, href: "/staff/members" },
      { label: "Active members (30d)", value: recentlyActiveMembers.totalDocs, href: "/staff/members" },
      { label: "New this month", value: newMembers.totalDocs, href: "/staff/members" },
      { label: "Queue backlog", value: visibleAttention.reduce((sum, item) => sum + item.value, 0), href: "/staff" },
      { label: "Completion rate", value: `${completionRate}%`, href: "/staff/learning?tab=analytics" },
      { label: "Active learners (30d)", value: activeLearners.totalDocs, href: "/staff/learning?tab=learners" },
      { label: "Active mentorships", value: activeMentorships.totalDocs, href: "/staff/mentorship" },
      { label: "Published opportunities", value: publishedOpportunities.totalDocs, href: "/staff/opportunities" },
      { label: "Applications", value: opportunityApplications.totalDocs, href: "/staff/opportunities" },
      { label: "Certificates issued", value: certificates.totalDocs, href: "/staff/certificates" },
      { label: "Certificates due", value: certificateBacklog, href: "/staff/certificates" },
      { label: "Source failures", value: failedSources.totalDocs, href: "/staff/opportunities" },
    ],
    health: [
      {
        label: "Opportunity sources",
        detail: failedSources.totalDocs
          ? `${failedSources.totalDocs} reporting errors`
          : lastSourceSync
            ? `Healthy · last sync ${new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(String(lastSourceSync)))}`
            : "No sync recorded yet",
        tone: failedSources.totalDocs ? "red" : "mint",
      },
      {
        label: "AI surfaces",
        detail: [
          process.env.AI_TUTOR_ENABLED === "true" ? "Tutor on" : "Tutor off",
          process.env.AI_CONTENT_STUDIO_ENABLED === "true" ? "Studio on" : "Studio off",
          process.env.AI_CAREER_COACH_ENABLED === "true" ? "Coach on" : "Coach off",
        ].join(" · "),
        tone: "blue",
      },
      {
        label: "Course readiness",
        detail: incompleteCourses ? `${incompleteCourses} courses blocked` : "Tracked courses ready or in draft",
        tone: incompleteCourses ? "amber" : "mint",
      },
    ] as Array<{ label: string; detail: string; tone: AttentionTone }>,
    activities: auditEvents.docs.map((event) => {
      const actorEmail =
        event.actor && typeof event.actor === "object" && "email" in event.actor
          ? String(event.actor.email || "")
          : "";
      return {
        label: readableAuditAction(event.action),
        detail: [event.entityType, event.entityId, actorEmail].filter(Boolean).join(" · "),
        at: event.createdAt,
        href: auditHref(event.entityType, event.entityId, event.action),
      };
    }),
    quickActions: quickActionsFor(role),
    inline: {
      mentors: canStaff(user as never, "mentorship", "support")
        ? (
            await payload.find({
              collection: "mentors",
              limit: 3,
              depth: 1,
              sort: "createdAt",
              where: { status: { equals: "draft" } },
              ...access,
            })
          ).docs.map((mentor) => ({
            id: mentor.id,
            title: typeof mentor.member === "object" && mentor.member && "name" in mentor.member
              ? String(mentor.member.name || mentor.title)
              : mentor.title,
            detail: `${mentor.seniority || "Mentor"} · ${mentor.availability || "availability unset"}`,
          }))
        : [],
      opportunities: canStaff(user as never, "opportunity", "support")
        ? (
            await payload.find({
              collection: "opportunities",
              limit: 3,
              depth: 0,
              sort: "createdAt",
              where: { status: { equals: "pending" } },
              ...access,
            })
          ).docs.map((item) => ({
            id: item.id,
            title: item.title,
            detail: `${item.company} · ${item.sourceLabel || "manual"}`,
            status: String(item.status),
          }))
        : [],
    },
  };
}

function roles(...values: StaffRole[]) {
  return values;
}

function tone(value: AttentionTone) {
  return value;
}

function staffRolesAll(): StaffRole[] {
  return ["super-admin", "content", "learning", "mentorship", "opportunity", "support", "analyst"];
}

function readableAuditAction(action: string) {
  return action
    .split(".")
    .join(" ")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function auditHref(entityType: string, entityId: string, action: string) {
  if (entityType === "opportunities" || action.startsWith("opportunity.")) return "/staff/opportunities";
  if (entityType.includes("mentor") || action.startsWith("mentorship.") || action.startsWith("mentor.")) return "/staff/mentorship";
  if (entityType === "certificates" || action.includes("certificate")) return "/staff/certificates";
  if (entityType.includes("lms") || action.startsWith("learning.")) return "/staff/learning";
  if (entityType === "members" || entityType === "member-notes") return `/staff/members`;
  return "/staff";
}

function quickActionsFor(role: StaffRole | null) {
  const all = [
    { href: "/staff/learning", label: "Open Course Builder", roles: roles("super-admin", "learning", "content", "support") },
    { href: "/staff/learning", label: "Create course", roles: roles("super-admin", "learning", "content") },
    { href: "/staff/opportunities", label: "Moderate opportunities", roles: roles("super-admin", "opportunity", "support") },
    { href: "/staff/opportunities", label: "Add opportunity", roles: roles("super-admin", "opportunity") },
    { href: "/staff/mentorship", label: "Review mentors", roles: roles("super-admin", "mentorship", "support") },
    { href: "/staff/certificates", label: "Issue certificate", roles: roles("super-admin", "learning", "support") },
    { href: "/staff/members", label: "Open Member 360", roles: roles("super-admin", "support", "mentorship", "learning", "analyst") },
    { href: "/staff/website/events/new", label: "Create event", roles: roles("super-admin", "content") },
    { href: "/staff/content/posts/new", label: "Publish article", roles: roles("super-admin", "content") },
    { href: "/staff/content/resources/new", label: "Add resource", roles: roles("super-admin", "content", "learning") },
    { href: "/staff/members", label: "View members", roles: staffRolesAll() },
  ];
  return all.filter((item) => !role || role === "super-admin" || role === "analyst" || item.roles.includes(role));
}
