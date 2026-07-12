import Link from "next/link";
import type { AdminViewServerProps } from "payload";

const tabs = [
  ["overview", "Overview"], ["curriculum", "Curriculum"], ["learners", "Learners"],
  ["assessments", "Assessments"], ["analytics", "Analytics"], ["settings", "Settings"],
  ["ai-content-studio", "AI Content Studio"],
] as const;

function relationID(value: unknown) {
  return String(value && typeof value === "object" && "id" in value ? value.id : value ?? "");
}

export default async function CourseBuilder({ initPageResult, payload, user, searchParams }: AdminViewServerProps) {
  const requestedID = typeof searchParams?.course === "string" ? searchParams.course : undefined;
  const requestedTab = typeof searchParams?.tab === "string" ? searchParams.tab : undefined;
  const activeTab = tabs.some(([key]) => key === requestedTab) ? requestedTab : "overview";
  const access = { overrideAccess: false, user: user ?? initPageResult.req.user } as const;
  const courses = await payload.find({ collection: "lms-courses", depth: 0, limit: 100, sort: "order", ...access });
  const selected = courses.docs.find((course) => String(course.id) === requestedID) ?? courses.docs[0];

  if (!selected) return <main className="smn-workspace"><span className="smn-eyebrow">Learning operations</span><h1>Course Builder</h1><p>Create the first course to begin building its curriculum.</p><Link className="smn-primary-action" href="/admin/collections/lms-courses/create">Create course</Link></main>;

  const courseID = String(selected.id);
  const [modules, lessons, enrollments, progress] = await Promise.all([
    payload.find({ collection: "lms-modules", depth: 0, limit: 500, sort: "order", where: { course: { equals: selected.id } }, ...access }),
    payload.find({ collection: "lms-lessons", depth: 0, limit: 1000, sort: "order", where: { course: { equals: selected.id } }, ...access }),
    payload.find({ collection: "enrollments", depth: 0, limit: 500, where: { programKey: { equals: selected.programKey } }, ...access }),
    payload.find({ collection: "lms-lesson-progress", depth: 0, limit: 2000, where: { course: { equals: selected.id } }, ...access }),
  ]);
  const lessonsByModule = new Map<string, typeof lessons.docs>();
  for (const lesson of lessons.docs) {
    const key = relationID(lesson.module);
    lessonsByModule.set(key, [...(lessonsByModule.get(key) ?? []), lesson]);
  }
  const readiness = [
    ["Course summary", Boolean(selected.summary)], ["Program access key", Boolean(selected.programKey)],
    ["At least one module", modules.totalDocs > 0],
    ["Every module has a lesson", modules.docs.length > 0 && modules.docs.every((item) => (lessonsByModule.get(String(item.id))?.length ?? 0) > 0)],
    ["All lessons published", lessons.totalDocs > 0 && lessons.docs.every((item) => item.status === "published")],
  ] as const;
  const completed = progress.docs.filter((item) => item.status === "completed").length;
  const base = `/admin/course-builder?course=${courseID}`;

  return <main className="smn-workspace">
    <header className="smn-workspace-header"><div><span className="smn-eyebrow">Learning operations</span><h1>Course Builder</h1><p>Build, review, and operate a course without losing its relationships.</p></div><div className="smn-workspace-actions"><Link href={`/admin/collections/lms-courses/${courseID}`}>Advanced edit</Link><Link className="smn-primary-action" href="/admin/collections/lms-courses/create">New course</Link></div></header>
    <div className="smn-course-switcher"><span>Course</span><nav>{courses.docs.map((course) => <Link className={String(course.id) === courseID ? "is-active" : ""} href={`/admin/course-builder?course=${course.id}&tab=${activeTab}`} key={course.id}>{course.title}</Link>)}</nav></div>
    <section className="smn-course-title"><div><span className={`smn-status smn-status--${selected.status}`}>{selected.status}</span><h2>{selected.title}</h2><p>{selected.summary}</p></div><dl><div><dt>Modules</dt><dd>{modules.totalDocs}</dd></div><div><dt>Lessons</dt><dd>{lessons.totalDocs}</dd></div><div><dt>Learners</dt><dd>{enrollments.totalDocs}</dd></div><div><dt>Completions</dt><dd>{completed}</dd></div></dl></section>
    <nav className="smn-workspace-tabs" aria-label="Course Builder sections">{tabs.map(([key, label]) => <Link aria-current={activeTab === key ? "page" : undefined} href={`${base}&tab=${key}`} key={key}>{label}</Link>)}</nav>
    {activeTab === "overview" ? <section className="smn-workspace-grid"><article><span className="smn-eyebrow">Readiness</span><h3>Publication checklist</h3><ul className="smn-checklist">{readiness.map(([label, ready]) => <li className={ready ? "is-ready" : ""} key={label}><span aria-hidden="true">{ready ? "✓" : "—"}</span>{label}</li>)}</ul></article><article><span className="smn-eyebrow">Course details</span><h3>At a glance</h3><dl className="smn-detail-list"><div><dt>Program key</dt><dd>{selected.programKey}</dd></div><div><dt>Access</dt><dd>{selected.accessRule}</dd></div><div><dt>Level</dt><dd>{selected.level ?? "Not set"}</dd></div><div><dt>Estimated time</dt><dd>{selected.estimatedHours ? `${selected.estimatedHours} hours` : "Not set"}</dd></div></dl></article></section> : null}
    {activeTab === "curriculum" ? <section className="smn-curriculum"><div className="smn-section-heading"><div><span className="smn-eyebrow">Curriculum</span><h3>Modules and lessons</h3></div><Link href={`/admin/collections/lms-modules/create?course=${courseID}`}>Add module</Link></div>{modules.docs.map((courseModule) => <article key={courseModule.id}><header><div><small>Module {Number(courseModule.order ?? 0) + 1}</small><h4>{courseModule.title}</h4></div><Link href={`/admin/collections/lms-modules/${courseModule.id}`}>Edit</Link></header><ol>{(lessonsByModule.get(String(courseModule.id)) ?? []).map((lesson) => <li key={lesson.id}><span>{lesson.title}<small>{lesson.lessonType} · {lesson.durationMinutes ?? 0} min</small></span><Link href={`/admin/collections/lms-lessons/${lesson.id}`}>Edit lesson</Link></li>)}</ol><Link href={`/admin/collections/lms-lessons/create?course=${courseID}&module=${courseModule.id}`}>Add lesson</Link></article>)}</section> : null}
    {activeTab === "learners" ? <section className="smn-placeholder"><h3>Learners</h3><p>{enrollments.totalDocs} enrollment records grant access through program key <b>{selected.programKey}</b>.</p><Link href={`/admin/collections/enrollments?where[programKey][equals]=${encodeURIComponent(selected.programKey)}`}>Manage enrollments</Link></section> : null}
    {activeTab === "assessments" ? <section className="smn-placeholder"><h3>Assessments</h3><p>Assessment authoring and grading will extend the existing lesson structure.</p></section> : null}
    {activeTab === "analytics" ? <section className="smn-placeholder"><h3>Analytics</h3><p>{completed} completed lesson records across {enrollments.totalDocs} enrolled learners. Completion and drop-off definitions arrive in R091.</p></section> : null}
    {activeTab === "settings" ? <section className="smn-placeholder"><h3>Settings</h3><p>Course access, publishing, certificate, and Tutor controls remain protected by the course record.</p><Link href={`/admin/collections/lms-courses/${courseID}`}>Edit course settings</Link></section> : null}
    {activeTab === "ai-content-studio" ? <section className="smn-placeholder"><h3>AI Content Studio</h3><p>This governed drafting workspace stays unavailable until the provider-independent AI foundation and approval controls are in place.</p></section> : null}
  </main>;
}
