import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { evaluateCourseReadiness, type CourseReadinessInput, type CurriculumLesson } from "@/lib/lms-readiness";
import { LessonActions, ModuleActions } from "./CurriculumActions";
import { ProgressOverrideForm } from "./ProgressOverrideForm";
import { calculateCourseAnalytics, type AnalyticsEnrollment, type AnalyticsLesson, type AnalyticsModule, type AnalyticsProgress } from "@/lib/lms-analytics";
import { ContentStudio } from "./ContentStudio";

const tabs = [
  ["overview", "Overview"], ["curriculum", "Curriculum"], ["learners", "Learners"],
  ["assessments", "Assessments"], ["analytics", "Analytics"], ["settings", "Settings"],
  ["ai-content-studio", "AI Content Studio"],
] as const;

function relationID(value: unknown) {
  return String(value && typeof value === "object" && "id" in value ? value.id : value ?? "");
}

export default async function CourseBuilder({ initPageResult, payload, searchParams }: AdminViewServerProps) {
  const requestedID = typeof searchParams?.course === "string" ? searchParams.course : undefined;
  const requestedTab = typeof searchParams?.tab === "string" ? searchParams.tab : undefined;
  const activeTab = tabs.some(([key]) => key === requestedTab) ? requestedTab : "overview";
  const access = { overrideAccess: false, req: initPageResult.req } as const;
  const courses = await payload.find({ collection: "lms-courses", depth: 0, limit: 100, sort: "order", ...access });
  const selected = courses.docs.find((course) => String(course.id) === requestedID) ?? courses.docs[0];

  if (!selected) return <main className="smn-workspace"><span className="smn-eyebrow">Learning operations</span><h1>Course Builder</h1><p>Create the first course to begin building its curriculum.</p><Link className="smn-primary-action" href="/admin/collections/lms-courses/create">Create course</Link></main>;

  const courseID = String(selected.id);
  const [modules, lessons, enrollments, progress] = await Promise.all([
    payload.find({ collection: "lms-modules", depth: 0, limit: 500, sort: "order", where: { course: { equals: selected.id } }, ...access }),
    payload.find({ collection: "lms-lessons", depth: 0, limit: 1000, sort: "order", where: { course: { equals: selected.id } }, ...access }),
    payload.find({ collection: "enrollments", depth: 1, limit: 500, where: { programKey: { equals: selected.programKey } }, ...access }),
    payload.find({ collection: "lms-lesson-progress", depth: 0, limit: 2000, where: { course: { equals: selected.id } }, ...access }),
  ]);
  const lessonsByModule = new Map<string, typeof lessons.docs>();
  for (const lesson of lessons.docs) {
    const key = relationID(lesson.module);
    lessonsByModule.set(key, [...(lessonsByModule.get(key) ?? []), lesson]);
  }
  const readiness = evaluateCourseReadiness(selected as unknown as CourseReadinessInput, modules.docs, lessons.docs as unknown as CurriculumLesson[]);
  const completed = progress.docs.filter((item) => item.status === "completed").length;
  const base = `/admin/course-builder?course=${courseID}`;
  const moduleOptions = modules.docs.map((item) => ({ id: item.id, title: String(item.title) }));
  const moduleIDs = modules.docs.map((item) => item.id);
  const learnerOptions = enrollments.docs.map((item) => { const member = item.member; return typeof member === "object" ? { id: member.id, label: member.name || member.email } : { id: member, label: `Member ${member}` }; });
  const lessonOptions = lessons.docs.map((item) => ({ id: item.id, label: String(item.title) }));
  const analytics = calculateCourseAnalytics(enrollments.docs as unknown as AnalyticsEnrollment[], modules.docs as unknown as AnalyticsModule[], lessons.docs as unknown as AnalyticsLesson[], progress.docs as unknown as AnalyticsProgress[]);
  const ai = payload as unknown as { find(args: unknown): Promise<{ totalDocs: number; docs: Array<{ rating?: string }> }> };
  const [tutorUsage, tutorFeedback, faqs, drafts] = activeTab === "ai-content-studio" ? await Promise.all([
    ai.find({ collection: "ai-usage-records", depth: 0, limit: 0, overrideAccess: false, req: initPageResult.req, where: { and: [{ feature: { equals: "tutor" } }, { operation: { contains: `course:${courseID}` } }] } }),
    ai.find({ collection: "ai-feedback", depth: 0, limit: 1000, overrideAccess: false, req: initPageResult.req, where: { and: [{ feature: { equals: "tutor" } }, { contextKey: { contains: `course:${courseID}` } }] } }),
    ai.find({ collection: "ai-knowledge-sources", depth: 0, limit: 0, overrideAccess: false, req: initPageResult.req, where: { and: [{ course: { equals: selected.id } }, { kind: { equals: "faq" } }, { approved: { equals: true } }] } }),
    ai.find({ collection: "ai-drafts", depth: 0, limit: 0, overrideAccess: false, req: initPageResult.req, where: { course: { equals: selected.id } } }),
  ]) : [{ totalDocs: 0, docs: [] }, { totalDocs: 0, docs: [] }, { totalDocs: 0, docs: [] }, { totalDocs: 0, docs: [] }];

  return <main className="smn-workspace">
    <header className="smn-workspace-header"><div><span className="smn-eyebrow">Learning operations</span><h1>Course Builder</h1><p>Build, review, and operate a course without losing its relationships.</p></div><div className="smn-workspace-actions"><Link href={`/admin/collections/lms-courses/${courseID}`}>Advanced edit</Link><Link className="smn-primary-action" href="/admin/collections/lms-courses/create">New course</Link></div></header>
    <div className="smn-course-switcher"><span>Course</span><nav>{courses.docs.map((course) => <Link className={String(course.id) === courseID ? "is-active" : ""} href={`/admin/course-builder?course=${course.id}&tab=${activeTab}`} key={course.id}>{course.title}</Link>)}</nav></div>
    <section className="smn-course-title"><div><span className={`smn-status smn-status--${selected.status}`}>{selected.status}</span><h2>{selected.title}</h2><p>{selected.summary}</p></div><dl><div><dt>Modules</dt><dd>{modules.totalDocs}</dd></div><div><dt>Lessons</dt><dd>{lessons.totalDocs}</dd></div><div><dt>Learners</dt><dd>{enrollments.totalDocs}</dd></div><div><dt>Completions</dt><dd>{completed}</dd></div></dl></section>
    <nav className="smn-workspace-tabs" aria-label="Course Builder sections">{tabs.map(([key, label]) => <Link aria-current={activeTab === key ? "page" : undefined} href={`${base}&tab=${key}`} key={key}>{label}</Link>)}</nav>
    {activeTab === "overview" ? <section className="smn-workspace-grid"><article><span className="smn-eyebrow">Readiness</span><h3>Publication checklist</h3><ul className="smn-checklist">{readiness.checks.map(({ label, ready }) => <li className={ready ? "is-ready" : ""} key={label}><span aria-hidden="true">{ready ? "✓" : "—"}</span>{label}</li>)}</ul></article><article><span className="smn-eyebrow">Course details</span><h3>At a glance</h3><dl className="smn-detail-list"><div><dt>Program key</dt><dd>{selected.programKey}</dd></div><div><dt>Access</dt><dd>{selected.accessRule}</dd></div><div><dt>Level</dt><dd>{selected.level ?? "Not set"}</dd></div><div><dt>Estimated time</dt><dd>{selected.estimatedHours ? `${selected.estimatedHours} hours` : "Not set"}</dd></div></dl></article></section> : null}
    {activeTab === "curriculum" ? <section className="smn-curriculum"><div className="smn-section-heading"><div><span className="smn-eyebrow">Curriculum</span><h3>Modules and lessons</h3></div><Link href={`/admin/collections/lms-modules/create?course=${courseID}`}>Add module</Link></div>{modules.docs.map((courseModule, moduleIndex) => { const moduleLessons = lessonsByModule.get(String(courseModule.id)) ?? []; const lessonIDs = moduleLessons.map((item) => item.id); return <article key={courseModule.id}><header><div><small>Module {moduleIndex + 1}</small><h4>{courseModule.title}</h4></div><div><Link href={`/admin/collections/lms-modules/${courseModule.id}`}>Edit</Link><ModuleActions courseId={courseID} moduleId={courseModule.id} moduleIds={moduleIDs} index={moduleIndex} empty={!moduleLessons.length} /></div></header><ol>{moduleLessons.map((lesson, lessonIndex) => <li key={lesson.id}><span>{lesson.title}<small>{lesson.lessonType} · {lesson.durationMinutes ?? 0} min</small></span><div><Link href={`/admin/collections/lms-lessons/${lesson.id}`}>Edit</Link><LessonActions courseId={courseID} lessonId={lesson.id} lessonIds={lessonIDs} index={lessonIndex} moduleId={courseModule.id} modules={moduleOptions} /></div></li>)}</ol><Link href={`/admin/collections/lms-lessons/create?course=${courseID}&module=${courseModule.id}`}>Add lesson</Link></article>; })}</section> : null}
    {activeTab === "learners" ? <section className="smn-placeholder"><h3>Learners</h3><p>{enrollments.totalDocs} enrollment records grant access through program key <b>{selected.programKey}</b>.</p><Link href={`/admin/collections/enrollments?where[programKey][equals]=${encodeURIComponent(selected.programKey)}`}>Manage enrollments</Link><h3>Reasoned progress override</h3><p>Every correction records the staff actor, timestamp, reason, and before/after state.</p><ProgressOverrideForm courseId={courseID} learners={learnerOptions} lessons={lessonOptions} /></section> : null}
    {activeTab === "assessments" ? <section className="smn-placeholder"><h3>Assessments</h3><p>Assessment authoring and grading will extend the existing lesson structure.</p></section> : null}
    {activeTab === "analytics" ? <section className="smn-placeholder"><h3>Analytics</h3><p>Activity uses a rolling 30-day window. Abandonment means a started, incomplete enrollment with no activity inside that window.</p><div className="smn-analytics-grid"><div><strong>{analytics.enrolled}</strong><span>Enrolled</span></div><div><strong>{analytics.activeLearners}</strong><span>Active (30d)</span></div><div><strong>{analytics.completionRate}%</strong><span>Completion rate</span></div><div><strong>{analytics.averageCompletionDays ?? "—"}</strong><span>Avg. completion days</span></div><div><strong>{analytics.inactiveLearners}</strong><span>Inactive learners</span></div><div><strong>{analytics.abandonmentRate}%</strong><span>Abandonment rate</span></div></div><h3>Module drop-off</h3><div className="smn-analytics-table"><div><b>Module</b><b>Reached</b><b>Completed</b><b>Drop-off</b></div>{analytics.moduleStats.map((item) => <div key={item.id}><span>{item.title}</span><span>{item.reached}</span><span>{item.completed}</span><span>{item.dropOff}</span></div>)}</div></section> : null}
    {activeTab === "settings" ? <section className="smn-placeholder"><h3>Settings</h3><p>Course access, publishing, certificate, and Tutor controls remain protected by the course record.</p><Link href={`/admin/collections/lms-courses/${courseID}`}>Edit course settings</Link></section> : null}
    {activeTab === "ai-content-studio" ? <ContentStudio courseId={selected.id} lessons={lessonOptions} report={{ usageCount: tutorUsage.totalDocs, helpful: tutorFeedback.docs.filter(item => item.rating === "helpful").length, notHelpful: tutorFeedback.docs.filter(item => item.rating === "not-helpful").length, faqCount: faqs.totalDocs, draftCount: drafts.totalDocs }}/> : null}
  </main>;
}
