import Link from "next/link";
import { ContentStudio } from "@/components/payload/ContentStudio";
import { LessonActions, ModuleActions } from "@/components/payload/CurriculumActions";
import { ProgressOverrideForm } from "@/components/payload/ProgressOverrideForm";
import { LearningCourseSwitcher, LearningTabNav } from "@/components/staff/LearningNav";
import {
  StaffEmpty,
  StaffEmptyState,
  StaffMetricGrid,
  StaffPageHeader,
  StaffPanel,
  staffOpsChrome,
} from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { isAIFeatureEnabled } from "@/lib/ai/config";
import { calculateCourseAnalytics, type AnalyticsEnrollment, type AnalyticsLesson, type AnalyticsModule, type AnalyticsProgress } from "@/lib/lms-analytics";
import { evaluateCourseReadiness, type CourseReadinessInput, type CurriculumLesson } from "@/lib/lms-readiness";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";
import { cn } from "@/lib/utils";
import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { AddLessonForm, AddModuleForm } from "./CurriculumCreateForms";

const allTabs = [
  ["overview", "Overview"],
  ["curriculum", "Curriculum"],
  ["learners", "Learners"],
  ["analytics", "Analytics"],
  ["settings", "Settings"],
  ["ai-content-studio", "AI Content Studio"],
] as const;

function relationID(value: unknown) {
  return String(value && typeof value === "object" && "id" in value ? value.id : value ?? "");
}

export default async function StaffLearningPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; tab?: string; member?: string }>;
}) {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning");
  const payload = await getPayloadClient();
  const access = staffAccess(staff);
  const params = await searchParams;
  const studioEnabled = isAIFeatureEnabled("content-studio");

  const tabs = (studioEnabled
    ? allTabs
    : allTabs.filter(([key]) => key !== "ai-content-studio")) as ReadonlyArray<readonly [string, string]>;

  const requestedID = typeof params.course === "string" ? params.course : undefined;
  const requestedTab = typeof params.tab === "string" ? params.tab : undefined;
  const activeTab = tabs.some(([key]) => key === requestedTab) ? requestedTab! : "overview";
  const focusMember = typeof params.member === "string" ? params.member : undefined;

  const courses = await payload.find({ collection: "lms-courses", depth: 0, limit: 100, sort: "order", ...access });
  const selected = courses.docs.find((course) => String(course.id) === requestedID) ?? courses.docs[0];

  if (!selected) {
    return (
      <div className="space-y-6">
        <StaffPageHeader
          eyebrow="Work"
          title="Learning"
          hint="Build programs members take inside the portal."
          action={{ href: "/staff/learning/courses/new", label: "Create program" }}
        />
        <p className="text-xs text-white/40">
          Looking for public website cards?{" "}
          <Link href="/staff/website/courses" className="text-baby-blue hover:underline">
            Public catalogue →
          </Link>
        </p>
        <StaffEmptyState
          title="Create your first program"
          steps={[
            { label: "Create program", href: "/staff/learning/courses/new", active: true },
            { label: "Add modules" },
            { label: "Publish" },
          ]}
          action={{ href: "/staff/learning/courses/new", label: "Create program" }}
        />
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
        eyebrow="Work"
        title="Learning"
        hint="Build and operate programs."
        action={{ href: "/staff/learning/courses/new", label: "New program" }}
      />
      <p className="text-xs text-white/40">
        Looking for public website cards?{" "}
        <Link href="/staff/website/courses" className="text-baby-blue hover:underline">
          Public catalogue →
        </Link>
      </p>

      <StaffPanel>
        <LearningCourseSwitcher
          courseId={courseID}
          activeTab={activeTab}
          courses={courses.docs.map((course) => ({
            id: course.id,
            title: String(course.title),
            status: course.status,
          }))}
        />
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

      <LearningTabNav
        base={base}
        activeTab={activeTab}
        studioEnabled={studioEnabled}
        highlightCurriculum={!readiness.ready}
      />

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
            {!readiness.ready ? (
              <p className="mt-4 text-sm text-white/55">
                Missing instructor, category, or learning outcomes? Edit them in{" "}
                <Link href={`${base}&tab=settings`} className="text-baby-blue hover:underline">
                  Settings
                </Link>
                .
              </p>
            ) : null}
          </StaffPanel>
          <StaffPanel>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Course details</p>
                <h3 className="mt-2 font-display text-xl text-white">At a glance</h3>
              </div>
              <Link href={`${base}&tab=settings`} className="text-xs text-baby-blue hover:underline">
                Edit in Settings
              </Link>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-white/45">Instructor</dt>
                <dd className="text-right text-white">{selected.instructor || "Not set — open Settings"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-white/45">Category</dt>
                <dd className="text-right text-white">{selected.category || "Not set — open Settings"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-white/45">Learning outcomes</dt>
                <dd className="text-right text-white">
                  {(selected.learningOutcomes || []).length
                    ? `${(selected.learningOutcomes || []).length} set`
                    : "Not set — open Settings"}
                </dd>
              </div>
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
                        <Link
                          href={`/staff/learning/modules/${courseModule.id}`}
                          className="mt-1 inline-block text-xs text-baby-blue hover:underline"
                        >
                          Edit module details
                        </Link>
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
                            <Link href={`/staff/learning/lessons/${lesson.id}`} className="block text-sm font-semibold text-white hover:text-baby-blue">
                              {lesson.title}
                            </Link>
                            <small className="text-xs text-white/40">
                              {lesson.lessonType} · {lesson.durationMinutes ?? 0} min · {lesson.status}
                            </small>
                            <Link
                              href={`/staff/learning/lessons/${lesson.id}`}
                              className="mt-1 inline-block text-xs text-baby-blue hover:underline"
                            >
                              Edit lesson details
                            </Link>
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
            {enrollments.totalDocs} enrolled · progress overrides stay under More tools.
          </p>
          {focusMember ? (
            <p className="mt-2 text-xs text-baby-blue">Focused on member {focusMember}</p>
          ) : null}
          <div className="mt-4 space-y-1">
            {enrollments.docs.slice(0, 25).map((item) => {
              const member = item.member;
              const memberId = typeof member === "object" ? member.id : member;
              const label =
                typeof member === "object" ? member.name || member.email : `Member ${member}`;
              const focused = focusMember && String(memberId) === String(focusMember);
              return (
                <Link
                  key={item.id}
                  href={`/staff/members?member=${memberId}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]",
                    focused && "border border-baby-blue/35 bg-baby-blue/10",
                  )}
                >
                  <b className="text-sm text-white">{label}</b>
                  <span className="text-xs text-white/45">
                    {item.status} · {item.completionPercent ?? 0}%
                  </span>
                </Link>
              );
            })}
            {!enrollments.docs.length ? <StaffEmpty>No learners enrolled yet.</StaffEmpty> : null}
          </div>
          <details className="mt-6 rounded-2xl border border-white/10 bg-near-black/30 p-4">
            <summary className="cursor-pointer text-sm text-white/70">Progress override</summary>
            <div className="mt-4">
              <ProgressOverrideForm courseId={courseID} learners={learnerOptions} lessons={lessonOptions} />
            </div>
          </details>
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
          <h3 className="font-display text-xl text-white">Course settings</h3>
          <p className="mt-2 mb-5 text-sm text-white/55">
            Set instructor, category, learning outcomes (one per line), access, publishing, certificate, and Tutor
            controls here. Curriculum lessons are edited from the Curriculum tab.
          </p>
          {!readiness.ready ? (
            <div className="mb-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100" role="status">
              Not ready to publish. Missing: {readiness.missing.join(", ")}.
            </div>
          ) : (
            <div className="mb-5 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint" role="status">
              Publication readiness checks passed. You can set status to published.
            </div>
          )}
          <StaffRecordForm
            collection="lms-courses"
            action="update"
            id={selected.id}
            submitLabel="Save course settings"
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "slug", label: "Slug", type: "text", required: true },
              { name: "summary", label: "Summary", type: "textarea", required: true },
              { name: "instructor", label: "Instructor", type: "text", placeholder: "Facilitator name" },
              { name: "category", label: "Category", type: "text" },
              { name: "programKey", label: "Program key", type: "text", required: true },
              {
                name: "classroomUrl",
                label: "Default Classroom / live link",
                type: "url",
                placeholder: "Paste invite link for live cohorts",
              },
              {
                name: "accessRule",
                label: "Access rule",
                type: "select",
                required: true,
                options: [
                  { label: "Matching enrollment", value: "enrolled" },
                  { label: "Any member", value: "member" },
                  { label: "Active/completed cohort member", value: "cohort" },
                ],
              },
              {
                name: "level",
                label: "Level",
                type: "select",
                options: [
                  { label: "Foundation", value: "foundation" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Advanced", value: "advanced" },
                ],
              },
              { name: "estimatedHours", label: "Estimated hours", type: "number" },
              { name: "prerequisites", label: "Prerequisites", type: "textarea", placeholder: "None" },
              {
                name: "learningOutcomesText",
                label: "Learning outcomes (one per line)",
                type: "textarea",
                placeholder: "Learners will be able to…",
              },
              { name: "tutorGuidance", label: "Tutor guidance (optional)", type: "textarea" },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived" },
                ],
              },
              { name: "enrollmentOpen", label: "Enrollment open", type: "checkbox" },
              { name: "certificateEnabled", label: "Certificate enabled", type: "checkbox" },
              { name: "previewEnabled", label: "Preview enabled", type: "checkbox" },
              { name: "tutorEnabled", label: "Tutor enabled (also requires env flag)", type: "checkbox" },
            ]}
            initial={{
              title: selected.title,
              slug: selected.slug,
              summary: selected.summary,
              instructor: selected.instructor || "",
              category: selected.category || "",
              programKey: selected.programKey,
              classroomUrl: (selected as { classroomUrl?: string | null }).classroomUrl || "",
              accessRule: selected.accessRule || "enrolled",
              level: selected.level || "foundation",
              estimatedHours: selected.estimatedHours ?? "",
              prerequisites: selected.prerequisites || "",
              learningOutcomesText: (selected.learningOutcomes || [])
                .map((item) => item?.outcome || "")
                .filter(Boolean)
                .join("\n"),
              tutorGuidance: selected.tutorGuidance || "",
              status: selected.status || "draft",
              enrollmentOpen: Boolean(selected.enrollmentOpen),
              certificateEnabled: Boolean(selected.certificateEnabled),
              previewEnabled: Boolean(selected.previewEnabled),
              tutorEnabled: Boolean(selected.tutorEnabled),
            }}
          />
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
