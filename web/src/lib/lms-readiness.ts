export type CourseReadinessInput = {
  title?: unknown;
  summary?: unknown;
  programKey?: unknown;
  instructor?: unknown;
  category?: unknown;
  learningOutcomes?: Array<{ outcome?: unknown }> | null;
};

export type CurriculumModule = { id: number | string };
export type CurriculumLesson = { module: number | string | { id: number | string }; status?: unknown };

function present(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function relationID(value: CurriculumLesson["module"]) {
  return String(typeof value === "object" ? value.id : value);
}

export function evaluateCourseReadiness(course: CourseReadinessInput, modules: CurriculumModule[], lessons: CurriculumLesson[]) {
  const checks = [
    { key: "title", label: "Course title", ready: present(course.title) },
    { key: "summary", label: "Course summary", ready: present(course.summary) },
    { key: "programKey", label: "Program access key", ready: present(course.programKey) },
    { key: "instructor", label: "Instructor", ready: present(course.instructor) },
    { key: "category", label: "Category", ready: present(course.category) },
    { key: "learningOutcomes", label: "At least one learning outcome", ready: Boolean(course.learningOutcomes?.some((item) => present(item.outcome))) },
    { key: "modules", label: "At least one module", ready: modules.length > 0 },
    { key: "moduleLessons", label: "Every module has a lesson", ready: modules.length > 0 && modules.every((module) => lessons.some((lesson) => relationID(lesson.module) === String(module.id))) },
    { key: "publishedLessons", label: "All lessons published", ready: lessons.length > 0 && lessons.every((lesson) => lesson.status === "published") },
  ];
  return { ready: checks.every((check) => check.ready), checks, missing: checks.filter((check) => !check.ready).map((check) => check.label) };
}
