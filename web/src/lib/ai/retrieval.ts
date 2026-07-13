import type { Payload } from "payload";
import { AIError } from "./types";

export type Citation = { id: string; label: string; href: string; excerpt: string };
export type RetrievedContext = { courseId: string; context: string; citations: Citation[]; declined: boolean };
const unsafeSource = /ignore\s+(all\s+)?(previous|system)|reveal\s+(the\s+)?system\s+prompt|<\/?(system|assistant|tool)>/i;
const words = (value: string) => new Set(value.toLowerCase().match(/[a-z0-9]{3,}/g) || []);
const score = (query: Set<string>, text: string) => [...words(text)].reduce((total, token) => total + (query.has(token) ? 1 : 0), 0);

export async function assertCourseEntitlement(payload: Payload, memberId: string | number, courseId: string | number) {
  const course = await payload.findByID({ collection: "lms-courses", id: courseId, depth: 0, overrideAccess: true });
  if (course.status !== "published") throw new AIError("This course is not available for Tutor access.", "unauthorized");
  if (course.accessRule === "member") return course;
  if (course.accessRule === "cohort") { const member = await payload.findByID({ collection: "members", id: memberId, depth: 0, overrideAccess: true }); if (["active", "alumni", "completed"].includes(String(member.cohortStatus).toLowerCase())) return course; }
  const enrollment = await payload.find({ collection: "enrollments", depth: 0, limit: 1, overrideAccess: true, where: { and: [{ member: { equals: memberId } }, { programKey: { equals: course.programKey } }, { status: { in: ["active", "completed"] } }] } });
  if (!enrollment.totalDocs) throw new AIError("You are not enrolled in this course.", "unauthorized");
  return course;
}

export async function retrieveCourseContext(payload: Payload, memberId: string | number, courseId: string | number, queryText: string, lessonId?: string | number): Promise<RetrievedContext> {
  const course = await assertCourseEntitlement(payload, memberId, courseId); const query = words(queryText);
  const [lessons, sources] = await Promise.all([
    payload.find({ collection: "lms-lessons", depth: 0, limit: 500, overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { status: { equals: "published" } }, ...(lessonId ? [{ id: { equals: lessonId } }] : [])] } }),
    (payload as unknown as { find(args: unknown): Promise<{ docs: Array<Record<string, unknown>> }> }).find({ collection: "ai-knowledge-sources", depth: 0, limit: 500, overrideAccess: true, where: { and: [{ course: { equals: course.id } }, { approved: { equals: true } }, ...(lessonId ? [{ or: [{ lesson: { equals: lessonId } }, { lesson: { exists: false } }] }] : [])] } }),
  ]);
  const candidates: Citation[] = [{ id: `course-${course.id}`, label: course.title, href: `/app/learning/courses/${course.slug}`, excerpt: `${course.summary}\n${(course.learningOutcomes || []).map(item => item.outcome).join("\n")}` }];
  for (const lesson of lessons.docs) candidates.push({ id: `lesson-${lesson.id}`, label: lesson.title, href: `/app/learning/courses/${course.slug}/lessons/${lesson.slug}`, excerpt: `${lesson.summary}\n${lesson.body || ""}\n${(lesson.attachments || []).map(item => item.label).join("\n")}` });
  for (const source of sources.docs) candidates.push({ id: `source-${source.id}`, label: String(source.citationLabel || source.title), href: lessonId ? `/app/learning/courses/${course.slug}/lessons/${lessonId}` : `/app/learning/courses/${course.slug}`, excerpt: String(source.content || "") });
  const citations = candidates
    .filter((item) => item.excerpt && !unsafeSource.test(item.excerpt))
    .map((item) => ({ id: item.id, label: item.label, href: item.href, excerpt: item.excerpt.slice(0, 4000), rank: score(query, `${item.label} ${item.excerpt}`) }))
    .filter((item) => item.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 8)
    .map(({ id, label, href, excerpt }) => ({ id, label, href, excerpt }));
  if (!citations.length) return { courseId: String(course.id), context: "", citations: [], declined: true };
  return { courseId: String(course.id), citations, declined: false, context: citations.map(item => `<source id="${item.id}" label="${item.label.replaceAll('"', "'")}">\n${item.excerpt}\n</source>`).join("\n\n") };
}
