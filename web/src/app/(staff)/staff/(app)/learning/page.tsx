import { Plus } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { CourseIndex, type CourseSummary } from "@/components/staff/CourseIndex";
import { StaffMetricGrid, StaffPageHeader } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { evaluateCourseReadiness, type CourseReadinessInput, type CurriculumLesson } from "@/lib/lms-readiness";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

export const metadata = { title: "Learning" };

function relationID(value: unknown) {
  return String(value && typeof value === "object" && "id" in value ? (value as { id: unknown }).id : (value ?? ""));
}

/** Anything that belongs to a course — the only field these helpers need. */
type CourseChild = { course?: unknown };

/** Group child records by the course they belong to, in one pass. */
function countByCourse(docs: CourseChild[]) {
  const counts = new Map<string, number>();
  for (const doc of docs) {
    const key = relationID(doc.course);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** Bucket child records by course id, preserving each row for readiness checks. */
function groupByCourse<T extends CourseChild>(docs: T[]) {
  const groups = new Map<string, T[]>();
  for (const doc of docs) {
    const key = relationID(doc.course);
    groups.set(key, [...(groups.get(key) ?? []), doc]);
  }
  return groups;
}

export default async function StaffLearningIndexPage() {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning");
  const payload = await getPayloadClient();
  const access = staffAccess(staff);

  // Fetch children once and bucket them locally rather than issuing 4 queries
  // per course — that fanned out badly as the catalogue grew.
  const [courses, modules, lessons, sessions, enrollments] = await Promise.all([
    payload.find({ collection: "lms-courses", depth: 0, limit: 200, sort: "-updatedAt", ...access }),
    payload.find({ collection: "lms-modules", depth: 0, limit: 2000, ...access }),
    payload.find({ collection: "lms-lessons", depth: 0, limit: 5000, ...access }),
    payload.find({ collection: "lms-sessions", depth: 0, limit: 2000, ...access }),
    payload.find({ collection: "enrollments", depth: 0, limit: 5000, ...access }),
  ]);

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
      id: course.id,
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

  const published = summaries.filter((course) => course.status === "published").length;
  const drafts = summaries.filter((course) => course.status === "draft").length;
  const cohorts = summaries.filter((course) => course.delivery === "cohort").length;
  const learners = summaries.reduce((total, course) => total + course.learnerCount, 0);

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Work"
        title="Learning"
        hint="Every course and live cohort you run, in one place."
      >
        <Button href="/staff/learning/courses/new">
          <Plus className="h-4 w-4" />
          New course
        </Button>
      </StaffPageHeader>

      {summaries.length ? (
        <StaffMetricGrid
          items={[
            { label: "Published", value: published, tone: "ai" },
            { label: "Drafts", value: drafts, tone: "warn" },
            { label: "Live cohorts", value: cohorts, tone: "accent" },
            { label: "Enrolled learners", value: learners, tone: "accent" },
          ]}
        />
      ) : null}

      <CourseIndex courses={summaries} />
    </div>
  );
}
