import Link from "next/link";
import { ContentStudio } from "@/components/payload/ContentStudio";
import { LessonActions, ModuleActions } from "@/components/payload/CurriculumActions";
import { ProgressOverrideForm } from "@/components/payload/ProgressOverrideForm";
import {
  StaffEmpty,
  StaffMetricGrid,
  StaffPageHeader,
  StaffPanel,
  staffOpsChrome,
} from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { calculateCourseAnalytics, type AnalyticsEnrollment, type AnalyticsLesson, type AnalyticsModule, type AnalyticsProgress } from "@/lib/lms-analytics";
import { evaluateCourseReadiness, type CourseReadinessInput, type CurriculumLesson } from "@/lib/lms-readiness";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";
import { cn } from "@/lib/utils";
import { AddLessonForm, AddModuleForm } from "./CurriculumCreateForms";

const baseTabs = [
  ["overview", "Overview"],
  ["curriculum", "Curriculum"],
  ["learners", "Learners"],
  ["analytics", "Analytics"],
  ["settings", "Settings"],
] as const;

function relationID(value: unknown) {
  return String(value && typeof value === "object" && "id" in value ? value.id : value ?? "");
}

export default async function StaffLearningPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; tab?: string }>;
}) {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning");
  const payload = await getPayloadClient();
  const access = staffAccess(staff);
  const params = await searchParams;
  const studioEnabled = process.env.AI_CONTENT_STUDIO_ENABLED === "true";

  const tabs = studioEnabled
    ? ([...baseTabs, ["ai-content-studio", "AI Content Studio"]] as const)
    : baseTabs;

  const requestedID = typeof params.course === "string" ? params.course : undefined;
  const requestedTab = typeof params.tab === "string" ? params.tab : undefined;
  const activeTab = tabs.some(([key]) => key === requestedTab) ? requestedTab! : "overview";

  const courses = await payload.find({ collection: "lms-courses", depth: 0, limit: 100, sort: "order", ...access });
  const selected = courses.docs.find((course) => String(course.id) === requestedID) ?? courses.docs[0];

  if (!selected) {
    return (
      <div className="space-y-6">
        <StaffPageHeader
          eyebrow="Learning operations"
          title="Course Builder"
          description="Create the first course to begin building its curriculum."
          action={{ href: "/staff/learning/courses/new", label: "Create course" }}
        />
        <StaffEmpty>No LMS courses yet.</StaffEmpty>
      </div>
    );
  }

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

  const readiness = evaluateCourseReadiness(
    selected as unknown as CourseReadinessInput,
    modules.docs,
    lessons.docs as unknown as CurriculumLesson[],
  );
  const completed = progress.docs.filter((item) => item.status === "completed").length;
  const base = `/staff/learning?course=${courseID}`;
  const moduleOptions = modules.docs.map((item) => ({ id: item.id, title: String(item.title) }));
  const moduleIDs = modules.docs.map((item) => item.id);
  const learnerOptions = enrollments.docs.map((item) => {
    const member = item.member;
    return typeof member === "object"
      ? { id: member.id, label: member.name || member.email }
      : { id: member, label: `Member ${member}` };
  });
  const lessonOptions = lessons.docs.map((item) => ({ id: item.id, label: String(item.title) }));
  const analytics = calculateCourseAnalytics(
    enrollments.docs as unknown as AnalyticsEnrollment[],
    modules.docs as unknown as AnalyticsModule[],
    lessons.docs as unknown as AnalyticsLesson[],
    progress.docs as unknown as AnalyticsProgress[],
  );

  const ai = payload as unknown as {
    find(args: unknown): Promise<{ totalDocs: number; docs: Array<{ rating?: string }> }>;
  };
  const [tutorUsage, tutorFeedback, faqs, drafts] =
    activeTab === "ai-content-studio" && studioEnabled
      ? await Promise.all([
          ai.find({
            collection: "ai-usage-records",
            depth: 0,
            limit: 0,
            ...access,
            where: { and: [{ feature: { equals: "tutor" } }, { operation: { contains: `course:${courseID}` } }] },
          }),
          ai.find({
            collection: "ai-feedback",
            depth: 0,
            limit: 1000,
            ...access,
            where: { and: [{ feature: { equals: "tutor" } }, { contextKey: { contains: `course:${courseID}` } }] },
          }),
          ai.find({
            collection: "ai-knowledge-sources",
            depth: 0,
            limit: 0,
            ...access,
            where: { and: [{ course: { equals: selected.id } }, { kind: { equals: "faq" } }, { approved: { equals: true } }] },
          }),
          ai.find({
            collection: "ai-drafts",
            depth: 0,
            limit: 0,
            ...access,
            where: { course: { equals: selected.id } },
          }),
        ])
      : [{ totalDocs: 0, docs: [] }, { totalDocs: 0, docs: [] }, { totalDocs: 0, docs: [] }, { totalDocs: 0, docs: [] }];

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader
        eyebrow="Learning operations"
        title="Course Builder"
        description="Build, review, and operate a course without losing its relationships."
        action={{ href: "/staff/learning/courses/new", label: "New course" }}
      />

      <StaffPanel>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Course</p>
        <nav className="flex flex-wrap gap-2" aria-label="Course picker">
          {courses.docs.map((course) => {
            const active = String(course.id) === courseID;
            return (
              <Link
                key={course.id}
                href={`/staff/learning?course=${course.id}&tab=${activeTab}`}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition",
                  active ? "border-baby-blue/50 bg-baby-blue/15 text-baby-blue" : "border-white/10 text-white/55 hover:border-white/25 hover:text-white",
                )}
              >
                {course.title}
              </Link>
            );
          })}
        </nav>
      </StaffPanel>

      <StaffPanel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/50">
              {selected.status}
            </span>
            <h2 className="mt-3 font-display text-2xl text-white">{selected.title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/55">{selected.summary}</p>
          </div>
        </div>
        <div className="mt-6">
          <StaffMetricGrid
            items={[
              { label: "Modules", value: modules.totalDocs },
              { label: "Lessons", value: lessons.totalDocs },
              { label: "Learners", value: enrollments.totalDocs },
              { label: "Completions", value: completed },
            ]}
          />
        </div>
      </StaffPanel>

      <nav className="flex gap-1 overflow-x-auto border-b border-white/10 pb-px" aria-label="Course Builder sections">
        {tabs.map(([key, label]) => (
          <Link
            key={key}
            href={`${base}&tab=${key}`}
            aria-current={activeTab === key ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-xs transition",
              activeTab === key ? "border-baby-blue text-white" : "border-transparent text-white/45 hover:text-white/70",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {activeTab === "overview" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <StaffPanel>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Readiness</p>
            <h3 className="mt-2 font-display text-xl text-white">Publication checklist</h3>
            <ul className="mt-4 space-y-2">
              {readiness.checks.map(({ label, ready }) => (
                <li key={label} className={cn("flex items-center gap-2 text-sm", ready ? "text-mint" : "text-white/45")}>
                  <span aria-hidden="true">{ready ? "✓" : "—"}</span>
                  {label}
                </li>
              ))}
            </ul>
          </StaffPanel>
          <StaffPanel>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Course details</p>
            <h3 className="mt-2 font-display text-xl text-white">At a glance</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-white/45">Program key</dt>
                <dd className="text-white">{selected.programKey}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-white/45">Access</dt>
                <dd className="text-white">{selected.accessRule}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-white/45">Level</dt>
                <dd className="text-white">{selected.level ?? "Not set"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Estimated time</dt>
                <dd className="text-white">{selected.estimatedHours ? `${selected.estimatedHours} hours` : "Not set"}</dd>
              </div>
            </dl>
          </StaffPanel>
        </div>
      ) : null}

      {activeTab === "curriculum" ? (
        <StaffPanel>
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Curriculum</p>
            <h3 className="mt-2 font-display text-xl text-white">Modules and lessons</h3>
          </div>
          {modules.docs.length ? (
            <div className="space-y-4">
              {modules.docs.map((courseModule, moduleIndex) => {
                const moduleLessons = lessonsByModule.get(String(courseModule.id)) ?? [];
                const lessonIDs = moduleLessons.map((item) => item.id);
                return (
                  <article key={courseModule.id} className="rounded-2xl border border-white/10 bg-near-black/30 p-4">
                    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <small className="text-[10px] uppercase tracking-wider text-white/35">Module {moduleIndex + 1}</small>
                        <h4 className="mt-1 text-lg text-white">{courseModule.title}</h4>
                      </div>
                      <ModuleActions
                        courseId={courseID}
                        moduleId={courseModule.id}
                        moduleIds={moduleIDs}
                        index={moduleIndex}
                        empty={!moduleLessons.length}
                      />
                    </header>
                    <ol className="mt-4 space-y-2">
                      {moduleLessons.map((lesson, lessonIndex) => (
                        <li
                          key={lesson.id}
                          className="flex flex-col gap-2 rounded-xl border border-white/5 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span>
                            <b className="block text-sm text-white">{lesson.title}</b>
                            <small className="text-xs text-white/40">
                              {lesson.lessonType} · {lesson.durationMinutes ?? 0} min · {lesson.status}
                            </small>
                          </span>
                          <LessonActions
                            courseId={courseID}
                            lessonId={lesson.id}
                            lessonIds={lessonIDs}
                            index={lessonIndex}
                            moduleId={courseModule.id}
                            modules={moduleOptions}
                          />
                        </li>
                      ))}
                    </ol>
                    <AddLessonForm courseId={courseID} moduleId={courseModule.id} order={moduleLessons.length} />
                  </article>
                );
              })}
            </div>
          ) : (
            <StaffEmpty>No modules yet. Add the first module below.</StaffEmpty>
          )}
          <AddModuleForm courseId={courseID} order={modules.docs.length} />
        </StaffPanel>
      ) : null}

      {activeTab === "learners" ? (
        <StaffPanel>
          <h3 className="font-display text-xl text-white">Learners</h3>
          <p className="mt-2 text-sm text-white/55">
            {enrollments.totalDocs} enrollment records grant access through program key{" "}
            <b className="text-white">{selected.programKey}</b>.
          </p>
          <h4 className="mt-6 text-sm font-medium text-white">Reasoned progress override</h4>
          <p className="mt-1 mb-4 text-xs text-white/45">
            Every correction records the staff actor, timestamp, reason, and before/after state.
          </p>
          <ProgressOverrideForm courseId={courseID} learners={learnerOptions} lessons={lessonOptions} />
        </StaffPanel>
      ) : null}

      {activeTab === "analytics" ? (
        <StaffPanel>
          <h3 className="font-display text-xl text-white">Analytics</h3>
          <p className="mt-2 mb-4 text-sm text-white/55">
            Activity uses a rolling 30-day window. Abandonment means a started, incomplete enrollment with no activity inside that window.
          </p>
          <StaffMetricGrid
            items={[
              { label: "Enrolled", value: analytics.enrolled },
              { label: "Active (30d)", value: analytics.activeLearners },
              { label: "Completion rate", value: `${analytics.completionRate}%` },
              { label: "Avg. completion days", value: analytics.averageCompletionDays ?? "—" },
              { label: "Inactive learners", value: analytics.inactiveLearners },
              { label: "Abandonment rate", value: `${analytics.abandonmentRate}%` },
            ]}
          />
          <h4 className="mt-6 mb-3 text-sm font-medium text-white">Module drop-off</h4>
          {analytics.moduleStats.length ? (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/[.03] text-xs uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="px-4 py-3 font-medium">Module</th>
                    <th className="px-4 py-3 font-medium">Reached</th>
                    <th className="px-4 py-3 font-medium">Completed</th>
                    <th className="px-4 py-3 font-medium">Drop-off</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.moduleStats.map((item) => (
                    <tr key={item.id}>
                      <td className="border-t border-white/5 px-4 py-3 text-white/75">{item.title}</td>
                      <td className="border-t border-white/5 px-4 py-3 text-white/75">{item.reached}</td>
                      <td className="border-t border-white/5 px-4 py-3 text-white/75">{item.completed}</td>
                      <td className="border-t border-white/5 px-4 py-3 text-white/75">{item.dropOff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <StaffEmpty>No module analytics yet.</StaffEmpty>
          )}
        </StaffPanel>
      ) : null}

      {activeTab === "settings" ? (
        <StaffPanel>
          <h3 className="font-display text-xl text-white">Settings</h3>
          <p className="mt-2 text-sm text-white/55">
            Course access, publishing, certificate, and Tutor controls remain on the course record.
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
              <dt className="text-white/45">Enrollment open</dt>
              <dd className="text-white">{selected.enrollmentOpen ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
              <dt className="text-white/45">Certificate enabled</dt>
              <dd className="text-white">{selected.certificateEnabled ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
              <dt className="text-white/45">Preview enabled</dt>
              <dd className="text-white">{selected.previewEnabled ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/45">Tutor enabled</dt>
              <dd className="text-white">{selected.tutorEnabled ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </StaffPanel>
      ) : null}

      {activeTab === "ai-content-studio" && studioEnabled ? (
        <StaffPanel>
          <ContentStudio
            courseId={selected.id}
            lessons={lessonOptions}
            report={{
              usageCount: tutorUsage.totalDocs,
              helpful: tutorFeedback.docs.filter((item) => item.rating === "helpful").length,
              notHelpful: tutorFeedback.docs.filter((item) => item.rating === "not-helpful").length,
              faqCount: faqs.totalDocs,
              draftCount: drafts.totalDocs,
            }}
          />
        </StaffPanel>
      ) : null}
    </div>
  );
}
