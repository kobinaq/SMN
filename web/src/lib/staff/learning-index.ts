import type { Payload } from "payload";
import type { CourseSummary } from "@/components/staff/CourseIndex";
import type { StaffUser } from "@/lib/auth/staff";
import { evaluateCourseReadiness, type CourseReadinessInput, type CurriculumLesson } from "@/lib/lms-readiness";
import { loadOrDescribe, type DataFailure } from "@/lib/staff/data-health";
import { staffAccess } from "@/lib/staff/records";

/**
 * The course catalogue, loaded and summarised once.
 *
 * Both the self-paced list and the cohort list need the same per-course rollup
 * (module/lesson/session counts, learner totals, publish-readiness), so the
 * query and the arithmetic live here rather than being copied into each page.
 * Callers filter the returned summaries by `delivery`.
 */

function relationID(value: unknown) {
  return String(value && typeof value === "object" && "id" in value ? (value as { id: unknown }).id : (value ?? ""));
}

type CourseChild = { course?: unknown };

function countByCourse(docs: CourseChild[]) {
  const counts = new Map<string, number>();
  for (const doc of docs) {
    const key = relationID(doc.course);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function groupByCourse<T extends CourseChild>(docs: T[]) {
  const groups = new Map<string, T[]>();
  for (const doc of docs) {
    const key = relationID(doc.course);
    groups.set(key, [...(groups.get(key) ?? []), doc]);
  }
  return groups;
}

export async function loadCourseSummaries(
  payload: Payload,
  staff: StaffUser,
): Promise<{ summaries: CourseSummary[]; failure: null } | { summaries: null; failure: DataFailure }> {
  const access = staffAccess(staff);

  // Fetch children once and bucket them locally rather than issuing 4 queries
  // per course — that fanned out badly as the catalogue grew. Wrapped rather
  // than left to throw so a database that predates the code names the problem
  // instead of 500-ing with a message React strips in production.
  const loaded = await loadOrDescribe("the course catalogue", () =>
    Promise.all([
      payload.find({ collection: "lms-courses", depth: 0, limit: 200, sort: "-updatedAt", ...access }),
      payload.find({ collection: "lms-modules", depth: 0, limit: 2000, ...access }),
      payload.find({ collection: "lms-lessons", depth: 0, limit: 5000, ...access }),
      payload.find({ collection: "lms-sessions", depth: 0, limit: 2000, ...access }),
      payload.find({ collection: "enrollments", depth: 0, limit: 5000, ...access }),
    ]),
  );

  if (loaded.failure) return { summaries: null, failure: loaded.failure };

  const [courses, modules, lessons, sessions, enrollments] = loaded.data;

  const moduleCounts = countByCourse(modules.docs);
  const lessonCounts = countByCourse(lessons.docs);
  const sessionCounts = countByCourse(sessions.docs);

  // Enrollments link by programKey (the stable key), not always by course id.
  const learnersByProgramKey = new Map<string, number>();
  for (const enrollment of enrollments.docs) {
    const key = String(enrollment.programKey ?? "");
    if (!key) continue;
    learnersByProgramKey.set(key, (learnersByProgramKey.get(key) ?? 0) + 1);
  }

  const modulesByCourse = groupByCourse(modules.docs);
  const lessonsByCourse = groupByCourse(lessons.docs);
  const sessionsByCourse = groupByCourse(sessions.docs);

  const summaries: CourseSummary[] = courses.docs.map((course) => {
    const key = String(course.id);
    const readiness = evaluateCourseReadiness(
      course as unknown as CourseReadinessInput,
      (modulesByCourse.get(key) ?? []) as unknown as Array<{ id: number | string }>,
      (lessonsByCourse.get(key) ?? []) as unknown as CurriculumLesson[],
      (sessionsByCourse.get(key) ?? []) as unknown as Array<{ status?: unknown }>,
    );
    return {
      id: course.id as string | number,
      title: String(course.title),
      slug: String(course.slug ?? ""),
      summary: String(course.summary ?? ""),
      status: (course.status as CourseSummary["status"]) ?? "draft",
      delivery: (course as { delivery?: string }).delivery === "cohort" ? "cohort" : "self-paced",
      programKey: String(course.programKey ?? ""),
      instructor: String(course.instructor ?? ""),
      moduleCount: moduleCounts.get(key) ?? 0,
      lessonCount: lessonCounts.get(key) ?? 0,
      sessionCount: sessionCounts.get(key) ?? 0,
      learnerCount: learnersByProgramKey.get(String(course.programKey ?? "")) ?? 0,
      updatedAt: String(course.updatedAt ?? ""),
      ready: readiness.ready,
    };
  });

  return { summaries, failure: null };
}
