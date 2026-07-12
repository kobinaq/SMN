export function calculateCourseCompletion(totalLessons: number, completedLessonIDs: Array<string | number>) {
  const completed = new Set(completedLessonIDs.map(String)).size;
  const boundedCompleted = Math.min(completed, Math.max(totalLessons, 0));
  const percent = totalLessons > 0 ? Math.round((boundedCompleted / totalLessons) * 100) : 0;
  return { completed: boundedCompleted, percent, isComplete: totalLessons > 0 && boundedCompleted === totalLessons };
}
