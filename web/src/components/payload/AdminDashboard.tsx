import Link from "next/link";
import type { ServerProps } from "payload";

type Attention = { label: string; detail: string; value: number; href: string; tone: string };
type Activity = { label: string; detail: string; at: string; href: string };

function startOfMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function readableDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminDashboard({ payload, user }: ServerProps) {
  const access = { overrideAccess: false, user } as const;
  const renderedAt = new Date();
  const now = renderedAt.toISOString();
  const activeSince = new Date(renderedAt.getTime() - 30 * 86_400_000).toISOString();

  const [
    members,
    newMembers,
    recentlyActiveMembers,
    enrollments,
    completedEnrollments,
    activeLearners,
    pendingMentors,
    activeMentorships,
    mentorshipRequests,
    pendingOpportunities,
    publishedOpportunities,
    opportunityApplications,
    expiringOpportunities,
    failedSources,
    draftCourses,
    courses,
    modules,
    lessons,
    certificates,
    recentMembers,
    recentMentors,
    recentOpportunities,
    recentCertificates,
    recentCourses,
  ] = await Promise.all([
    payload.count({ collection: "members", ...access }),
    payload.count({ collection: "members", where: { createdAt: { greater_than_equal: startOfMonth() } }, ...access }),
    payload.count({ collection: "members", where: { updatedAt: { greater_than_equal: activeSince } }, ...access }),
    payload.count({ collection: "enrollments", ...access }),
    payload.count({ collection: "enrollments", where: { status: { equals: "completed" } }, ...access }),
    payload.count({ collection: "lms-lesson-progress", where: { updatedAt: { greater_than_equal: activeSince } }, ...access }),
    payload.count({ collection: "mentors", where: { status: { equals: "draft" } }, ...access }),
    payload.count({ collection: "mentorship-requests", where: { status: { equals: "introduced" } }, ...access }),
    payload.count({ collection: "mentorship-requests", where: { status: { in: ["new", "reviewing"] } }, ...access }),
    payload.count({ collection: "opportunities", where: { status: { equals: "pending" } }, ...access }),
    payload.count({ collection: "opportunities", where: { status: { equals: "published" } }, ...access }),
    payload.count({ collection: "opportunity-applications", ...access }),
    payload.count({ collection: "opportunities", where: { and: [{ status: { equals: "published" } }, { expiresAt: { greater_than_equal: now } }, { expiresAt: { less_than_equal: daysFromNow(14) } }] }, ...access }),
    payload.count({ collection: "opportunity-sources", where: { lastError: { exists: true } }, ...access }),
    payload.count({ collection: "lms-courses", where: { status: { equals: "draft" } }, ...access }),
    payload.find({ collection: "lms-courses", limit: 200, depth: 0, sort: "-updatedAt", ...access }),
    payload.find({ collection: "lms-modules", limit: 1000, depth: 0, ...access }),
    payload.find({ collection: "lms-lessons", limit: 2000, depth: 0, ...access }),
    payload.count({ collection: "certificates", where: { status: { equals: "valid" } }, ...access }),
    payload.find({ collection: "members", limit: 4, depth: 0, sort: "-createdAt", ...access }),
    payload.find({ collection: "mentors", limit: 4, depth: 1, sort: "-approvedAt", where: { status: { equals: "approved" } }, ...access }),
    payload.find({ collection: "opportunities", limit: 4, depth: 0, sort: "-publishedAt", where: { status: { equals: "published" } }, ...access }),
    payload.find({ collection: "certificates", limit: 4, depth: 1, sort: "-issuedAt", where: { status: { equals: "valid" } }, ...access }),
    payload.find({ collection: "lms-courses", limit: 4, depth: 0, sort: "-updatedAt", ...access }),
  ]);

  const modulesByCourse = new Map<string, number>();
  const lessonsByModule = new Map<string, number>();
  for (const courseModule of modules.docs) {
    const courseId = typeof courseModule.course === "object" ? courseModule.course.id : courseModule.course;
    modulesByCourse.set(String(courseId), (modulesByCourse.get(String(courseId)) || 0) + 1);
  }
  for (const lesson of lessons.docs) {
    const moduleId = typeof lesson.module === "object" ? lesson.module.id : lesson.module;
    lessonsByModule.set(String(moduleId), (lessonsByModule.get(String(moduleId)) || 0) + 1);
  }
  const incompleteCourses = courses.docs.filter((course) => {
    const courseModules = modules.docs.filter((module) => String(typeof module.course === "object" ? module.course.id : module.course) === String(course.id));
    return !courseModules.length || courseModules.some((module) => !lessonsByModule.get(String(module.id)));
  }).length;

  const attention: Attention[] = [
    { label: "Mentor applications", detail: "Awaiting staff review", value: pendingMentors.totalDocs, href: "/admin/collections/mentors?where[status][equals]=draft", tone: "mint" },
    { label: "Mentorship requests", detail: "New or under review", value: mentorshipRequests.totalDocs, href: "/admin/collections/mentorship-requests", tone: "violet" },
    { label: "Imported opportunities", detail: "Awaiting publication decision", value: pendingOpportunities.totalDocs, href: "/admin/collections/opportunities?where[status][equals]=pending", tone: "amber" },
    { label: "Expiring opportunities", detail: "Closing in the next 14 days", value: expiringOpportunities.totalDocs, href: "/admin/collections/opportunities?where[status][equals]=published", tone: "amber" },
    { label: "Incomplete courses", detail: "Missing a module or lesson", value: incompleteCourses, href: "/admin/collections/lms-courses", tone: "blue" },
    { label: "Draft courses", detail: "Not yet published", value: draftCourses.totalDocs, href: "/admin/collections/lms-courses?where[status][equals]=draft", tone: "blue" },
    { label: "Source failures", detail: "Opportunity imports reporting errors", value: failedSources.totalDocs, href: "/admin/collections/opportunity-sources", tone: "red" },
  ].filter((item) => item.value > 0);

  const activities: Activity[] = [
    ...recentMembers.docs.map((doc) => ({ label: "New member joined", detail: doc.name || doc.email, at: doc.createdAt, href: `/admin/collections/members/${doc.id}` })),
    ...recentMentors.docs.filter((doc) => doc.approvedAt).map((doc) => ({ label: "Mentor approved", detail: doc.title, at: String(doc.approvedAt), href: `/admin/collections/mentors/${doc.id}` })),
    ...recentOpportunities.docs.filter((doc) => doc.publishedAt).map((doc) => ({ label: "Opportunity published", detail: `${doc.title} · ${doc.company}`, at: String(doc.publishedAt), href: `/admin/collections/opportunities/${doc.id}` })),
    ...recentCertificates.docs.map((doc) => ({ label: "Certificate issued", detail: doc.title, at: doc.issuedAt, href: `/admin/collections/certificates/${doc.id}` })),
    ...recentCourses.docs.map((doc) => ({ label: "Course updated", detail: doc.title, at: doc.updatedAt, href: `/admin/collections/lms-courses/${doc.id}` })),
  ].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, 10);

  const completionRate = enrollments.totalDocs ? Math.round((completedEnrollments.totalDocs / enrollments.totalDocs) * 100) : 0;
  const email = user && "email" in user ? String(user.email || "") : "";
  const name = user && "name" in user && user.name ? String(user.name) : email.split("@")[0] || "team";
  const metrics = [
    ["Total members", members.totalDocs], ["Active members (30d)", recentlyActiveMembers.totalDocs], ["New this month", newMembers.totalDocs],
    ["Enrolled learners", enrollments.totalDocs], ["Active learners (30d)", activeLearners.totalDocs], ["Completion rate", `${completionRate}%`],
    ["Active mentorships", activeMentorships.totalDocs], ["Pending mentors", pendingMentors.totalDocs], ["Published opportunities", publishedOpportunities.totalDocs],
    ["Applications", opportunityApplications.totalDocs], ["Certificates issued", certificates.totalDocs],
  ] as const;

  return <main className="smn-dashboard">
    <section className="smn-dashboard-hero"><div><span className="smn-eyebrow">SMN operations</span><h1>Welcome back, {name}.</h1><p>Priorities, platform health, and the next useful action—without collection hopping.</p></div><Link className="smn-site-link" href="/" target="_blank">View live site ↗</Link></section>
    <section className="smn-dashboard-section"><div className="smn-section-heading"><div><span className="smn-eyebrow">Attention required</span><h2>What needs action</h2></div><small>{attention.length ? `${attention.length} active queues` : "All tracked queues are clear"}</small></div>{attention.length ? <div className="smn-attention-grid">{attention.map((item) => <Link className={`smn-attention smn-attention--${item.tone}`} href={item.href} key={item.label}><strong>{item.value}</strong><div><b>{item.label}</b><span>{item.detail}</span></div><i>Open →</i></Link>)}</div> : <p className="smn-empty">No tracked operational issues need attention.</p>}</section>
    <section className="smn-quick-actions"><div><span className="smn-eyebrow">Quick actions</span><h2>Keep things moving</h2></div><nav aria-label="Quick actions"><Link href="/admin/collections/lms-courses/create">Create course</Link><Link href="/admin/collections/opportunities/create">Add opportunity</Link><Link href="/admin/collections/mentors?where[status][equals]=draft">Review mentors</Link><Link href="/admin/collections/certificates/create">Issue certificate</Link><Link href="/admin/collections/events/create">Create event</Link><Link href="/admin/collections/posts/create">Publish article</Link><Link href="/admin/collections/resources/create">Add resource</Link><Link href="/admin/collections/members">View members</Link></nav></section>
    <section className="smn-dashboard-section"><div className="smn-section-heading"><div><span className="smn-eyebrow">Platform overview</span><h2>Network health</h2></div><small>Activity uses the last 30 days</small></div><div className="smn-overview-grid">{metrics.map(([label, value]) => <div className="smn-overview-metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
    <section className="smn-dashboard-section"><div className="smn-section-heading"><div><span className="smn-eyebrow">Recent activity</span><h2>Meaningful changes</h2></div></div><div className="smn-activity-list">{activities.map((item) => <Link href={item.href} key={`${item.label}-${item.href}-${item.at}`}><span><b>{item.label}</b><small>{item.detail}</small></span><time dateTime={item.at}>{readableDate(item.at)}</time></Link>)}</div></section>
  </main>;
}
