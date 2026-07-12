import type { MemberUser } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { youtubeEmbedUrl } from "@/lib/youtube";

type Relation<T> = T | string | number | null | undefined;
type Status = "not-started" | "in-progress" | "completed";

type EnrollmentDoc = {
  id: string | number;
  programKey: string;
  status: string;
};

type MediaDoc = { url?: string | null };
type LmsCourseDoc = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  programKey: string;
  accessRule: "enrolled" | "member" | "cohort";
  level?: string | null;
  estimatedHours?: number | null;
  cover?: Relation<MediaDoc>;
  order?: number | null;
  status: "draft" | "published" | "archived";
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
  lessonType: "video" | "reading" | "download" | "assignment";
  youtubeUrl?: string | null;
  durationMinutes?: number | null;
  body?: string | null;
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
};

export type LmsCourseDetail = LmsCourseCard & {
  modules: LmsModule[];
};

export type LmsLessonDetail = LmsLessonListItem & {
  course: LmsCourseCard;
  moduleTitle: string;
  youtubeEmbedUrl: string;
  body: string;
  attachments: { label: string; url: string }[];
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
  const enrolled = enrollments.some(
    (enrollment) =>
      enrollment.programKey === course.programKey && ["active", "completed"].includes(enrollment.status),
  );
  if (course.accessRule === "enrolled") return enrolled;
  return enrolled || member.cohortStatus === "active" || member.cohortStatus === "completed";
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
    attachments: (lesson.attachments || [])
      .map((item) => ({ label: item.label || "Download", url: mediaUrl(item.file) }))
      .filter((item) => item.url),
    previousHref: flat[currentIndex - 1]?.href || "",
    nextHref: flat[currentIndex + 1]?.href || "",
  } satisfies LmsLessonDetail;
}
