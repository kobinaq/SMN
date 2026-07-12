type ID = string | number;
type Enrollment = { member: ID | { id: ID }; status?: unknown; startedAt?: string | null; lastActivityAt?: string | null; completedAt?: string | null };
type Module = { id: ID; title?: unknown; order?: unknown };
type Lesson = { id: ID; module: ID | { id: ID } };
type Progress = { member: ID | { id: ID }; lesson: ID | { id: ID }; status?: unknown };

const id = (value: ID | { id: ID }) => String(typeof value === "object" ? value.id : value);

export function calculateCourseAnalytics(enrollments: Enrollment[], modules: Module[], lessons: Lesson[], progress: Progress[], now = new Date()) {
  const inactivityCutoff = now.getTime() - 30 * 86_400_000;
  const completedEnrollments = enrollments.filter((item) => item.status === "completed" || item.completedAt);
  const startedEnrollments = enrollments.filter((item) => item.startedAt);
  const activeLearners = enrollments.filter((item) => item.lastActivityAt && Date.parse(item.lastActivityAt) >= inactivityCutoff).length;
  const inactiveLearners = enrollments.filter((item) => item.status !== "completed" && item.lastActivityAt && Date.parse(item.lastActivityAt) < inactivityCutoff).length;
  const completionDays = completedEnrollments.flatMap((item) => item.startedAt && item.completedAt ? [(Date.parse(item.completedAt) - Date.parse(item.startedAt)) / 86_400_000] : []);
  const moduleStats = modules.map((courseModule) => {
    const moduleLessonIDs = lessons.filter((lesson) => id(lesson.module) === String(courseModule.id)).map((lesson) => String(lesson.id));
    const reachedMembers = new Set(progress.filter((item) => moduleLessonIDs.includes(id(item.lesson)) && item.status !== "not-started").map((item) => id(item.member)));
    const completedMembers = new Set([...reachedMembers].filter((memberID) => moduleLessonIDs.length > 0 && moduleLessonIDs.every((lessonID) => progress.some((item) => id(item.member) === memberID && id(item.lesson) === lessonID && item.status === "completed"))));
    return { id: courseModule.id, title: String(courseModule.title ?? "Untitled module"), reached: reachedMembers.size, completed: completedMembers.size, dropOff: Math.max(0, reachedMembers.size - completedMembers.size) };
  });
  return {
    enrolled: enrollments.length,
    started: startedEnrollments.length,
    activeLearners,
    completed: completedEnrollments.length,
    completionRate: enrollments.length ? Math.round((completedEnrollments.length / enrollments.length) * 100) : 0,
    averageCompletionDays: completionDays.length ? Math.round((completionDays.reduce((sum, value) => sum + value, 0) / completionDays.length) * 10) / 10 : null,
    inactiveLearners,
    abandonmentRate: startedEnrollments.length ? Math.round((inactiveLearners / startedEnrollments.length) * 100) : 0,
    moduleStats,
  };
}
