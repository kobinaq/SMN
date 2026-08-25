import type { MemberUser } from "@/lib/auth/member";
import { memberHasEnrollment } from "@/lib/lms-enroll";
import { calculateCohortCompletion, isAttended, pickNextSession } from "@/lib/lms-cohort";
import { getPayloadClient } from "@/lib/payload";
import { youtubeEmbedUrl } from "@/lib/youtube";

type Relation<T> = T | string | number | null | undefined;
type Status = "not-started" | "in-progress" | "completed";

type EnrollmentDoc = {
  id: string | number;
  programName?: string | null;
  programKey: string;
  programType?: string | null;
  status: string;
  classroomUrl?: string | null;
  courseUrl?: string | null;
  course?: Relation<{ id: string | number }>;
};

export type MemberEnrollment = {
  id: string | number;
  programName: string;
  programType: string;
  status: string;
  classroomUrl: string;
  courseUrl: string;
};

export async function getMemberEnrollments(member: MemberUser): Promise<MemberEnrollment[]> {
  const docs = await getEnrollments(member);
  return docs.map((doc) => ({
    id: doc.id,
    programName: doc.programName || "Programme",
    programType: doc.programType || "",
    status: doc.status,
    classroomUrl: doc.classroomUrl || "",
    courseUrl: doc.courseUrl || "",
  }));
}

type MediaDoc = { url?: string | null };
type LmsCourseDoc = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  programKey: string;
  accessRule: "enrolled" | "member" | "cohort";
  delivery?: "cohort" | "self-paced" | null;
  classroomUrl?: string | null;
  startDate?: string | null;
  duration?: string | null;
  sessions?: string | null;
  seats?: number | null;
  level?: string | null;
  estimatedHours?: number | null;
  instructor?: string | null;
  category?: string | null;
  prerequisites?: string | null;
  learningOutcomes?: Array<{ outcome?: string | null }> | null;
  certificateEnabled?: boolean | null;
  cover?: Relation<MediaDoc>;
  order?: number | null;
  status: "draft" | "published" | "archived";
  tutorEnabled?: boolean | null;
};
type LmsModuleDoc = {
  id: string | number;
  course: Relation<LmsCourseDoc>;
  title: string;
  slug: string;
  summary?: string | null;
  order?: number | null;
  status: "draft" | "published" | "archived";
};
type LmsLessonDoc = {
  id: string | number;
  course: Relation<LmsCourseDoc>;
  module: Relation<LmsModuleDoc>;
  title: string;
  slug: string;
  summary: string;
  lessonType: "video" | "reading" | "download" | "assignment" | "classroom";
  youtubeUrl?: string | null;
  classroomUrl?: string | null;
  sessionAt?: string | null;
  durationMinutes?: number | null;
  body?: string | null;
  resourceLabel?: string | null;
  resourceUrl?: string | null;
  attachments?: { label?: string | null; file?: Relation<MediaDoc> }[] | null;
  order?: number | null;
  status: "draft" | "published" | "archived";
};

type ProgressDoc = {
  id: string | number;
  lesson: Relation<LmsLessonDoc>;
  status: Status;
};

export type LmsLessonListItem = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  lessonType: string;
  durationMinutes: number;
  status: Status;
  href: string;
};

export type LmsModule = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  lessons: LmsLessonListItem[];
};

export type LmsCourseCard = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  programKey: string;
  level: string;
  estimatedHours: number;
  coverUrl: string;
  lessonCount: number;
  completedCount: number;
  percentage: number;
  href: string;
  continueHref: string;
  tutorEnabled: boolean;
  instructor: string;
  category: string;
  prerequisites: string;
  learningOutcomes: string[];
  certificateEnabled: boolean;
  classroomUrl: string;
  delivery: "cohort" | "self-paced";
  startDate: string;
  duration: string;
  sessionsNote: string;
  seats: number;
};

export type LmsCourseDetail = LmsCourseCard & {
  modules: LmsModule[];
};

export type CohortSession = {
  id: string | number;
  title: string;
  summary: string;
  sessionAt: string;
  durationMinutes: number;
  joinUrl: string;
  recordingUrl: string;
  resources: { label: string; url: string }[];
  attendance: string;
  attended: boolean;
  isPast: boolean;
};

export type CohortAnnouncement = {
  id: string | number;
  title: string;
  body: string;
  pinned: boolean;
  publishedAt: string;
  author: string;
};

export type CohortRosterMember = {
  id: string | number;
  name: string;
  handle: string;
};

export type CohortPost = {
  id: string | number;
  body: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  isSelf: boolean;
};

export type CohortWorkspace = {
  course: LmsCourseDetail;
  sessions: CohortSession[];
  nextSession: CohortSession | null;
  announcements: CohortAnnouncement[];
  roster: CohortRosterMember[];
  discussion: CohortPost[];
  sessionCount: number;
  attendedCount: number;
  percentage: number;
};

export type LmsLessonDetail = LmsLessonListItem & {
  course: LmsCourseCard;
  moduleTitle: string;
  youtubeEmbedUrl: string;
  body: string;
  resourceLabel: string;
  resourceUrl: string;
  attachments: { label: string; url: string }[];
  classroomUrl: string;
  sessionAt: string;
  previousHref: string;
  nextHref: string;
};

function relationId(value: Relation<{ id: string | number }>) {
  return typeof value === "object" && value ? value.id : value;
}

function mediaUrl(value: Relation<MediaDoc>) {
  return typeof value === "object" && value ? value.url || "" : "";
}

function hasCourseAccess(member: MemberUser, course: LmsCourseDoc, enrollments: EnrollmentDoc[]) {
  if (course.status !== "published") return false;
  if (course.accessRule === "member") return true;
  if (course.accessRule === "cohort") {
    const cohortMember = member.cohortStatus === "active" || member.cohortStatus === "completed";
    return cohortMember || memberHasEnrollment(enrollments, course);
  }
  return memberHasEnrollment(enrollments, course);
}

async function getEnrollments(member: MemberUser) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "enrollments",
    depth: 0,
    limit: 100,
    overrideAccess: true,
    where: { member: { equals: member.id } },
  });
  return result.docs as EnrollmentDoc[];
}

function progressMap(progress: ProgressDoc[]) {
  return new Map(progress.map((item) => [String(relationId(item.lesson)), item.status]));
}

function continueLessonHref(courseSlug: string, lessons: LmsLessonDoc[], progress: Map<string, Status>) {
  const ordered = [...lessons].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const inProgress = ordered.find((lesson) => progress.get(String(lesson.id)) === "in-progress");
  const nextOpen = ordered.find((lesson) => progress.get(String(lesson.id)) !== "completed");
  const target = inProgress || nextOpen || ordered[0];
  return target ? `/app/learning/courses/${courseSlug}/lessons/${target.slug}` : `/app/learning/courses/${courseSlug}`;
}

function toCourseCard(course: LmsCourseDoc, lessons: LmsLessonDoc[], progress: Map<string, Status>) {
  const completedCount = lessons.filter((lesson) => progress.get(String(lesson.id)) === "completed").length;
  const lessonCount = lessons.length;
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    summary: course.summary,
    programKey: course.programKey,
    level: course.level || "foundation",
    estimatedHours: course.estimatedHours || 0,
    coverUrl: mediaUrl(course.cover),
    lessonCount,
    completedCount,
    percentage: lessonCount ? Math.round((completedCount / lessonCount) * 100) : 0,
    href: `/app/learning/courses/${course.slug}`,
    continueHref: continueLessonHref(course.slug, lessons, progress),
    tutorEnabled: Boolean(course.tutorEnabled),
    instructor: course.instructor?.trim() || "",
    category: course.category?.trim() || "",
    prerequisites: course.prerequisites?.trim() || "",
    learningOutcomes: (Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [])
      .map((item) => item?.outcome?.trim() || "")
      .filter(Boolean),
    certificateEnabled: Boolean(course.certificateEnabled),
    classroomUrl: course.classroomUrl || "",
    delivery: (course.delivery === "cohort" ? "cohort" : "self-paced") as "cohort" | "self-paced",
    startDate: course.startDate?.trim() || "",
    duration: course.duration?.trim() || "",
    sessionsNote: course.sessions?.trim() || "",
    seats: course.seats ?? 0,
  };
}

function toLessonItem(courseSlug: string, lesson: LmsLessonDoc, progress: Map<string, Status>) {
  return {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    summary: lesson.summary,
    lessonType: lesson.lessonType,
    durationMinutes: lesson.durationMinutes || 0,
    status: progress.get(String(lesson.id)) || "not-started",
    href: `/app/learning/courses/${courseSlug}/lessons/${lesson.slug}`,
  };
}

export async function getLmsCourses(member: MemberUser) {
  const payload = await getPayloadClient();
  const enrollments = await getEnrollments(member);
  const [courseResult, lessonResult, progressResult] = await Promise.all([
    payload.find({ collection: "lms-courses", depth: 1, limit: 100, sort: "order,title", overrideAccess: true, where: { status: { equals: "published" } } }),
    payload.find({ collection: "lms-lessons", depth: 0, limit: 500, sort: "order,title", overrideAccess: true, where: { status: { equals: "published" } } }),
    payload.find({ collection: "lms-lesson-progress", depth: 0, limit: 500, overrideAccess: true, where: { member: { equals: member.id } } }),
  ]);
  const progress = progressMap(progressResult.docs as ProgressDoc[]);
  return (courseResult.docs as LmsCourseDoc[])
    .filter((course) => hasCourseAccess(member, course, enrollments))
    .map((course) => {
      const lessons = (lessonResult.docs as LmsLessonDoc[]).filter(
        (lesson) => String(relationId(lesson.course)) === String(course.id),
      );
      return toCourseCard(course, lessons, progress);
    });
}

export async function getLmsCourse(member: MemberUser, courseSlug: string): Promise<LmsCourseDetail | null> {
  const payload = await getPayloadClient();
  const enrollments = await getEnrollments(member);
  const courseResult = await payload.find({
    collection: "lms-courses",
    depth: 1,
    limit: 1,
    overrideAccess: true,
    where: { and: [{ slug: { equals: courseSlug } }, { status: { equals: "published" } }] },
  });
  const course = courseResult.docs[0] as LmsCourseDoc | undefined;
  if (!course || !hasCourseAccess(member, course, enrollments)) return null;
  const [moduleResult, lessonResult, progressResult] = await Promise.all([
    payload.find({ collection: "lms-modules", depth: 0, limit: 100, sort: "order,title", overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { status: { equals: "published" } }] } }),
    payload.find({ collection: "lms-lessons", depth: 0, limit: 500, sort: "order,title", overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { status: { equals: "published" } }] } }),
    payload.find({ collection: "lms-lesson-progress", depth: 0, limit: 500, overrideAccess: true, where: { member: { equals: member.id } } }),
  ]);
  const progress = progressMap(progressResult.docs as ProgressDoc[]);
  const lessons = lessonResult.docs as LmsLessonDoc[];
  return {
    ...toCourseCard(course, lessons, progress),
    modules: (moduleResult.docs as LmsModuleDoc[]).map((module) => ({
      id: module.id,
      title: module.title,
      slug: module.slug,
      summary: module.summary || "",
      lessons: lessons
        .filter((lesson) => String(relationId(lesson.module)) === String(module.id))
        .map((lesson) => toLessonItem(course.slug, lesson, progress)),
    })),
  };
}

export async function getLmsLesson(member: MemberUser, courseSlug: string, lessonSlug: string) {
  const course = await getLmsCourse(member, courseSlug);
  if (!course) return null;
  const payload = await getPayloadClient();
  const lessonResult = await payload.find({
    collection: "lms-lessons",
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: { and: [{ slug: { equals: lessonSlug } }, { course: { equals: course.id } }, { status: { equals: "published" } }] },
  });
  const lesson = lessonResult.docs[0] as LmsLessonDoc | undefined;
  if (!lesson) return null;
  const flat = course.modules.flatMap((module) => module.lessons);
  const currentIndex = flat.findIndex((item) => String(item.id) === String(lesson.id));
  const current = flat[currentIndex];
  const currentModule = course.modules.find((item) =>
    item.lessons.some((listItem) => String(listItem.id) === String(lesson.id)),
  );
  return {
    ...current,
    course,
    moduleTitle: currentModule?.title || "",
    youtubeEmbedUrl: youtubeEmbedUrl(lesson.youtubeUrl || ""),
    body: lesson.body || "",
    resourceLabel: lesson.resourceLabel?.trim() || "Open resource",
    resourceUrl: lesson.resourceUrl?.trim() || "",
    attachments: (lesson.attachments || [])
      .map((item) => ({ label: item.label || "Download", url: mediaUrl(item.file) }))
      .filter((item) => item.url),
    classroomUrl: lesson.classroomUrl?.trim() || course.classroomUrl || "",
    sessionAt: lesson.sessionAt || "",
    previousHref: flat[currentIndex - 1]?.href || "",
    nextHref: flat[currentIndex + 1]?.href || "",
  } satisfies LmsLessonDetail;
}

type SessionDoc = {
  id: string | number;
  title: string;
  summary?: string | null;
  sessionAt?: string | null;
  durationMinutes?: number | null;
  joinUrl?: string | null;
  recordingUrl?: string | null;
  resources?: { label?: string | null; file?: Relation<MediaDoc> }[] | null;
};
type AttendanceDoc = { session?: Relation<{ id: string | number }>; status?: string | null };
type AnnouncementDoc = {
  id: string | number;
  title: string;
  body: string;
  pinned?: boolean | null;
  publishedAt?: string | null;
  author?: Relation<{ name?: string | null }>;
};
type RosterEnrollmentDoc = { member?: Relation<{ id: string | number; name?: string | null; handle?: string | null }>; status: string };
type DiscussionDoc = {
  id: string | number;
  body: string;
  authorName?: string | null;
  authorRole?: string | null;
  createdAt: string;
  authorMember?: Relation<{ id: string | number }>;
};

export async function getCohortWorkspace(member: MemberUser, courseSlug: string): Promise<CohortWorkspace | null> {
  const course = await getLmsCourse(member, courseSlug);
  if (!course) return null;

  const payload = await getPayloadClient();
  const [sessionResult, attendanceResult, announcementResult, rosterResult, discussionResult] = await Promise.all([
    payload.find({ collection: "lms-sessions", depth: 1, limit: 500, sort: "sessionAt", overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { status: { equals: "published" } }] } }),
    payload.find({ collection: "lms-attendance", depth: 0, limit: 500, overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { member: { equals: member.id } }] } }),
    payload.find({ collection: "lms-announcements", depth: 1, limit: 100, sort: "-publishedAt", overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { status: { equals: "published" } }] } }),
    payload.find({ collection: "enrollments", depth: 1, limit: 500, overrideAccess: true, where: { and: [{ programKey: { equals: course.programKey } }, { status: { in: ["active", "completed"] } }] } }),
    payload.find({ collection: "lms-discussion-posts", depth: 0, limit: 200, sort: "createdAt", overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { status: { equals: "visible" } }] } }),
  ]);

  const attendanceBySession = new Map<string, string>();
  for (const row of attendanceResult.docs as AttendanceDoc[]) {
    attendanceBySession.set(String(relationId(row.session)), row.status || "");
  }

  const now = Date.now();
  const sessions: CohortSession[] = (sessionResult.docs as SessionDoc[]).map((session) => {
    const status = attendanceBySession.get(String(session.id)) || "";
    const startMs = session.sessionAt ? new Date(session.sessionAt).getTime() : 0;
    return {
      id: session.id,
      title: session.title,
      summary: session.summary?.trim() || "",
      sessionAt: session.sessionAt || "",
      durationMinutes: session.durationMinutes || 0,
      joinUrl: session.joinUrl?.trim() || course.classroomUrl || "",
      recordingUrl: session.recordingUrl?.trim() || "",
      resources: (session.resources || [])
        .map((item) => ({ label: item.label || "Resource", url: mediaUrl(item.file) }))
        .filter((item) => item.url),
      attendance: status,
      attended: isAttended(status),
      isPast: startMs > 0 && startMs < now,
    };
  });

  const completion = calculateCohortCompletion(
    sessions.length,
    sessions.filter((session) => session.attended).map((session) => session.id),
  );

  const announcements: CohortAnnouncement[] = (announcementResult.docs as AnnouncementDoc[])
    .map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      pinned: Boolean(item.pinned),
      publishedAt: item.publishedAt || "",
      author: typeof item.author === "object" && item.author ? item.author.name?.trim() || "SMN team" : "SMN team",
    }))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const rosterSeen = new Set<string>();
  const roster: CohortRosterMember[] = [];
  for (const enrollment of rosterResult.docs as RosterEnrollmentDoc[]) {
    const rosterMember = enrollment.member;
    if (typeof rosterMember !== "object" || !rosterMember) continue;
    const key = String(rosterMember.id);
    if (rosterSeen.has(key)) continue;
    rosterSeen.add(key);
    roster.push({
      id: rosterMember.id,
      name: rosterMember.name?.trim() || "SMN member",
      handle: rosterMember.handle?.trim() || "",
    });
  }

  const discussion: CohortPost[] = (discussionResult.docs as DiscussionDoc[]).map((post) => ({
    id: post.id,
    body: post.body,
    authorName: post.authorName?.trim() || "SMN member",
    authorRole: post.authorRole || "member",
    createdAt: post.createdAt,
    isSelf: String(relationId(post.authorMember)) === String(member.id),
  }));

  return {
    course: { ...course, percentage: completion.percent },
    sessions,
    nextSession: pickNextSession(sessions.filter((session) => session.sessionAt)),
    announcements,
    roster,
    discussion,
    sessionCount: sessions.length,
    attendedCount: completion.attended,
    percentage: completion.percent,
  };
}
