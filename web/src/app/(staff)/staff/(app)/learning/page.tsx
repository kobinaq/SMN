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
import { StaffRecordForm, StaffDeleteButton } from "@/components/staff/StaffRecordForm";
import { AddLessonForm, AddModuleForm } from "./CurriculumCreateForms";
import { AddSessionForm, AnnouncementComposer, AttendanceRegister } from "./CohortOpsForms";

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

  const requestedID = typeof params.course === "string" ? params.course : undefined;
  const requestedTab = typeof params.tab === "string" ? params.tab : undefined;
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

  const isCohort = (selected as { delivery?: string | null }).delivery === "cohort";
  const allowedTabs = new Set(["overview", "curriculum", "assessments", "gradebook", "learners", "analytics", "settings"]);
  if (studioEnabled) allowedTabs.add("ai-content-studio");
  if (isCohort) {
    allowedTabs.add("sessions");
    allowedTabs.add("announcements");
  }
  const activeTab = requestedTab && allowedTabs.has(requestedTab) ? requestedTab : "overview";

  const courseID = String(selected.id);
  const [modules, lessons, enrollments, progress, assessments, submissions, sessions] = await Promise.all([
    payload.find({ collection: "lms-modules", depth: 0, limit: 500, sort: "order", where: { course: { equals: selected.id } }, ...access }),
    payload.find({ collection: "lms-lessons", depth: 0, limit: 1000, sort: "order", where: { course: { equals: selected.id } }, ...access }),
    payload.find({ collection: "enrollments", depth: 1, limit: 500, where: { programKey: { equals: selected.programKey } }, ...access }),
    payload.find({ collection: "lms-lesson-progress", depth: 0, limit: 2000, where: { course: { equals: selected.id } }, ...access }),
    payload.find({ collection: "lms-assessments", depth: 0, limit: 200, sort: "order", where: { course: { equals: selected.id } }, ...access }),
    payload.find({
      collection: "lms-submissions",
      depth: 1,
      limit: 200,
      sort: "-updatedAt",
      where: { and: [{ course: { equals: selected.id } }, { status: { in: ["submitted", "returned"] } }] },
      ...access,
    }),
    isCohort
      ? payload.find({ collection: "lms-sessions", depth: 0, limit: 500, sort: "sessionAt", where: { course: { equals: selected.id } }, ...access })
      : Promise.resolve({ docs: [], totalDocs: 0 }),
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
    sessions.docs as unknown as { status?: unknown }[],
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

  const roster = learnerOptions.map((item) => ({ id: item.id, label: String(item.label) }));
  const [attendance, announcements] =
    isCohort && activeTab === "sessions"
      ? await Promise.all([
          payload.find({ collection: "lms-attendance", depth: 0, limit: 2000, where: { course: { equals: selected.id } }, ...access }),
          Promise.resolve({ docs: [], totalDocs: 0 }),
        ])
      : isCohort && activeTab === "announcements"
        ? await Promise.all([
            Promise.resolve({ docs: [], totalDocs: 0 }),
            payload.find({ collection: "lms-announcements", depth: 1, limit: 100, sort: "-publishedAt", where: { course: { equals: selected.id } }, ...access }),
          ])
        : [{ docs: [], totalDocs: 0 }, { docs: [], totalDocs: 0 }];

  const attendanceBySession = new Map<string, Record<string, string>>();
  for (const row of attendance.docs as Array<{ session?: unknown; member?: unknown; status?: string }>) {
    const sessionKey = relationID(row.session);
    const memberKey = relationID(row.member);
    const map = attendanceBySession.get(sessionKey) ?? {};
    map[memberKey] = row.status || "";
    attendanceBySession.set(sessionKey, map);
  }

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader
        eyebrow="Work"
        title="Learning"
        hint="Build and operate programs."
        action={{ href: "/staff/learning/courses/new", label: "New program" }}
      />

      <StaffPanel>
        <LearningCourseSwitcher
          courseId={courseID}
          activeTab={activeTab}
          courses={courses.docs.map((course) => ({
            id: course.id,
            title: String(course.title),
            status: `${course.status || "draft"} · ${(course as { delivery?: string }).delivery === "cohort" ? "cohort" : "self-paced"}`,
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
        cohort={isCohort}
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
                    <AddLessonForm
                      courseId={courseID}
                      moduleId={courseModule.id}
                      order={moduleLessons.length}
                      delivery={(selected as { delivery?: string | null }).delivery}
                    />
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

      {activeTab === "sessions" && isCohort ? (
        <StaffPanel>
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Cohort</p>
            <h3 className="mt-2 font-display text-xl text-white">Live sessions</h3>
            <p className="mt-1 text-sm text-white/55">
              Schedule live sessions, share the join link and recording, and take attendance. Attendance drives each learner&apos;s cohort progress.
            </p>
          </div>
          {sessions.docs.length ? (
            <div className="space-y-3">
              {sessions.docs.map((session) => {
                const when = session.sessionAt ? new Date(String(session.sessionAt)) : null;
                const initialAttendance = attendanceBySession.get(String(session.id)) ?? {};
                return (
                  <article key={session.id} className="rounded-2xl border border-white/10 bg-near-black/30 p-4">
                    <header className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg text-white">{session.title}</h4>
                        <small className="text-xs text-white/40">
                          {when && !Number.isNaN(when.getTime())
                            ? when.toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })
                            : "Date not set"}
                          {session.durationMinutes ? ` · ${session.durationMinutes} min` : ""} · {session.status}
                        </small>
                      </div>
                      {session.joinUrl ? (
                        <a href={String(session.joinUrl)} target="_blank" rel="noreferrer" className="text-xs text-baby-blue hover:underline">
                          Join link
                        </a>
                      ) : null}
                    </header>
                    <details className="mt-3 rounded-xl border border-white/10 bg-ink/40 p-3">
                      <summary className="cursor-pointer text-sm text-white/70">Take attendance ({roster.length})</summary>
                      <AttendanceRegister
                        sessionId={session.id}
                        courseId={courseID}
                        roster={roster}
                        initial={initialAttendance}
                      />
                    </details>
                    <details className="mt-2 rounded-xl border border-white/10 bg-ink/40 p-3">
                      <summary className="cursor-pointer text-sm text-white/70">Edit session</summary>
                      <div className="mt-4">
                        <StaffRecordForm
                          collection="lms-sessions"
                          action="update"
                          id={session.id}
                          submitLabel="Save session"
                          fields={[
                            { name: "title", label: "Title", type: "text", required: true },
                            { name: "sessionAt", label: "Starts at", type: "datetime-local", required: true },
                            { name: "durationMinutes", label: "Duration (minutes)", type: "number" },
                            { name: "joinUrl", label: "Join link", type: "url" },
                            { name: "recordingUrl", label: "Recording link", type: "url" },
                            { name: "summary", label: "Summary", type: "textarea" },
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
                          ]}
                          initial={{
                            title: String(session.title || ""),
                            sessionAt: session.sessionAt ? String(session.sessionAt).slice(0, 16) : "",
                            durationMinutes: (session as { durationMinutes?: number | null }).durationMinutes ?? "",
                            joinUrl: (session as { joinUrl?: string | null }).joinUrl || "",
                            recordingUrl: (session as { recordingUrl?: string | null }).recordingUrl || "",
                            summary: (session as { summary?: string | null }).summary || "",
                            status: String(session.status || "published"),
                          }}
                        />
                        <div className="mt-3">
                          <StaffDeleteButton collection="lms-sessions" id={session.id} redirectTo={`${base}&tab=sessions`} />
                        </div>
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          ) : (
            <StaffEmpty>No sessions scheduled yet. Add the first one below.</StaffEmpty>
          )}
          <AddSessionForm courseId={courseID} order={sessions.docs.length} />
        </StaffPanel>
      ) : null}

      {activeTab === "announcements" && isCohort ? (
        <StaffPanel>
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Cohort</p>
            <h3 className="mt-2 font-display text-xl text-white">Announcements</h3>
            <p className="mt-1 text-sm text-white/55">Broadcast updates to everyone in this cohort. Pinned posts stay at the top of their feed.</p>
          </div>
          <AnnouncementComposer courseId={courseID} />
          <div className="mt-4 space-y-2">
            {announcements.docs.length ? (
              announcements.docs.map((announcement) => {
                const author = announcement.author;
                const authorName = author && typeof author === "object" ? (author as { name?: string }).name || "SMN team" : "SMN team";
                return (
                  <article key={announcement.id} className="rounded-2xl border border-white/10 bg-near-black/30 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {announcement.pinned ? (
                        <span className="rounded-full border border-baby-blue/30 bg-baby-blue/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-baby-blue">Pinned</span>
                      ) : null}
                      <h4 className="text-base text-white">{announcement.title}</h4>
                      <span className="ml-auto text-xs text-white/40">
                        {authorName}
                        {announcement.publishedAt ? ` · ${new Date(String(announcement.publishedAt)).toLocaleDateString("en-GH", { dateStyle: "medium" })}` : ""}
                        {" · "}{announcement.status}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/60">{announcement.body}</p>
                    <div className="mt-3">
                      <StaffDeleteButton collection="lms-announcements" id={announcement.id} redirectTo={`${base}&tab=announcements`} />
                    </div>
                  </article>
                );
              })
            ) : (
              <StaffEmpty>No announcements yet.</StaffEmpty>
            )}
          </div>
        </StaffPanel>
      ) : null}

      {activeTab === "assessments" ? (
        <StaffPanel>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Gradebook</p>
              <h3 className="mt-2 font-display text-xl text-white">Assessments</h3>
            </div>
            <Link
              href={`/staff/learning/assessments/new?course=${courseID}`}
              className="text-sm text-baby-blue hover:underline"
            >
              New assessment
            </Link>
          </div>
          {assessments.docs.length ? (
            <div className="space-y-2">
              {assessments.docs.map((item) => (
                <Link
                  key={item.id}
                  href={`/staff/learning/assessments/${item.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 transition hover:border-baby-blue/35"
                >
                  <span>
                    <span className="block text-sm font-semibold text-white">{item.title}</span>
                    <span className="text-xs text-white/40">
                      {item.kind} · {item.status}
                      {item.dueAt ? ` · due ${new Date(item.dueAt).toLocaleDateString("en-GH")}` : ""}
                    </span>
                  </span>
                  <span className="text-xs text-white/45">{item.totalMarks || 0} marks</span>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No assessments yet. Create a quiz or assignment.</StaffEmpty>
          )}
        </StaffPanel>
      ) : null}

      {activeTab === "gradebook" ? (
        <StaffPanel>
          <h3 className="font-display text-xl text-white">Submitted work</h3>
          <p className="mt-2 mb-4 text-sm text-white/55">Queue of work waiting for a score or return.</p>
          {submissions.docs.length ? (
            <div className="space-y-2">
              {submissions.docs.map((item) => {
                const assessment = item.assessment && typeof item.assessment === "object" ? item.assessment : null;
                const member = item.member && typeof item.member === "object" ? item.member : null;
                return (
                  <Link
                    key={item.id}
                    href={`/staff/learning/submissions/${item.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 transition hover:border-baby-blue/35"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        {assessment?.title || "Assessment"}
                      </span>
                      <span className="text-xs text-white/40">
                        {member?.name || member?.email || "Learner"} · attempt {item.attemptNumber || 1} · {item.status}
                      </span>
                    </span>
                    <span className="text-xs text-baby-blue">Grade</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <StaffEmpty>No submitted work waiting.</StaffEmpty>
          )}
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
            Set instructor, category, delivery, how people join, Classroom invite, public
            intake copy, and publishing. Curriculum lessons are edited from the Curriculum tab.
            Quizzes and assignments live under Assessments.
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
                name: "delivery",
                label: "Programme type",
                type: "select",
                required: true,
                options: [
                  { label: "Self-paced course", value: "self-paced" },
                  { label: "Live cohort", value: "cohort" },
                ],
              },
              {
                name: "commerce",
                label: "How people join",
                type: "select",
                required: true,
                options: [
                  { label: "Buy now (Paystack)", value: "purchase" },
                  { label: "Apply first", value: "apply" },
                ],
              },
              { name: "amount", label: "Amount (pesewas)", type: "number", placeholder: "e.g. 250000 for GH₵2,500" },
              { name: "currency", label: "Currency", type: "text", placeholder: "GHS" },
              { name: "price", label: "Price label (optional)", type: "text", placeholder: "Blank uses the confirmed amount" },
              { name: "badge", label: "Badge", type: "text", placeholder: "Recommended" },
              {
                name: "classroomUrl",
                label: "Google Classroom invite",
                type: "url",
                placeholder: "Paste invite link for this cohort",
              },
              {
                name: "featured",
                label: "Next intake on the marketing site",
                type: "checkbox",
                description: "Homepage, /programs/cohort, and /apply use this published cohort.",
              },
              { name: "startDate", label: "Start (public)", type: "text", placeholder: "September 2026" },
              {
                name: "applicationDeadline",
                label: "Application deadline",
                type: "text",
                placeholder: "Rolling. Apply early",
              },
              { name: "duration", label: "Duration", type: "text", placeholder: "8 weeks" },
              { name: "seats", label: "Seats", type: "number" },
              { name: "sessions", label: "Sessions", type: "text", placeholder: "2 live sessions per week" },
              { name: "format", label: "Format", type: "text" },
              { name: "audience", label: "Audience", type: "textarea" },
              {
                name: "priceConfirmed",
                label: "Fee is confirmed for the public site",
                type: "checkbox",
              },
              { name: "priceLabel", label: "Price label", type: "text", placeholder: "GH₵2,500" },
              { name: "priceNote", label: "Price note", type: "textarea" },
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
              delivery: (selected as { delivery?: string | null }).delivery || "self-paced",
              commerce: (selected as { commerce?: string | null }).commerce || "purchase",
              amount: (selected as { amount?: number | null }).amount ?? "",
              currency: (selected as { currency?: string | null }).currency || "GHS",
              price: (selected as { price?: string | null }).price || "",
              badge: (selected as { badge?: string | null }).badge || "",
              classroomUrl: (selected as { classroomUrl?: string | null }).classroomUrl || "",
              featured: Boolean((selected as { featured?: boolean | null }).featured),
              startDate: (selected as { startDate?: string | null }).startDate || "",
              applicationDeadline: (selected as { applicationDeadline?: string | null }).applicationDeadline || "",
              duration: (selected as { duration?: string | null }).duration || "",
              seats: (selected as { seats?: number | null }).seats ?? "",
              sessions: (selected as { sessions?: string | null }).sessions || "",
              format: (selected as { format?: string | null }).format || "",
              audience: (selected as { audience?: string | null }).audience || "",
              priceConfirmed: Boolean((selected as { priceConfirmed?: boolean | null }).priceConfirmed),
              priceLabel: (selected as { priceLabel?: string | null }).priceLabel || "",
              priceNote: (selected as { priceNote?: string | null }).priceNote || "",
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
