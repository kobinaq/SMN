import type { MemberUser } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";

export type LearningEnrollment = { id: string | number; programName: string; programKey: string; programType: string; status: string; classroomUrl: string; courseUrl: string; startsAt: string; endsAt: string };
export type LearningDashboardItem = { id: string | number; title: string; summary: string; programKey: string; kind: string; week: number; order: number; estimatedMinutes: number; url: string; status: "not-started" | "in-progress" | "completed" };

type AccessItem = { id: string | number; programKey: string; accessRule: "member" | "enrolled" | "cohort"; status: string };

export function canAccessLearningItem(member: MemberUser, item: AccessItem, enrollments: LearningEnrollment[]) {
  if (item.status !== "published") return false;
  if (item.accessRule === "member") return true;
  const matching = enrollments.some((enrollment) => enrollment.programKey === item.programKey && ["active", "completed"].includes(enrollment.status));
  if (item.accessRule === "enrolled") return matching;
  return matching || member.cohortStatus === "active" || member.cohortStatus === "completed";
}

export async function getLearningDashboard(member: MemberUser) {
  const payload = await getPayloadClient();
  const [enrollmentResult, itemResult, progressResult] = await Promise.all([
    payload.find({ collection: "enrollments", depth: 0, limit: 100, sort: "-startsAt", overrideAccess: true, where: { member: { equals: member.id } } }),
    payload.find({ collection: "learning-items", depth: 2, limit: 300, sort: "week,order", overrideAccess: true, where: { status: { equals: "published" } } }),
    payload.find({ collection: "progress", depth: 0, limit: 500, overrideAccess: true, where: { member: { equals: member.id } } }),
  ]);
  const enrollments: LearningEnrollment[] = enrollmentResult.docs.map((doc) => ({ id: doc.id, programName: doc.programName, programKey: doc.programKey, programType: doc.programType, status: doc.status, classroomUrl: doc.classroomUrl || "", courseUrl: doc.courseUrl || "", startsAt: doc.startsAt || "", endsAt: doc.endsAt || "" }));
  const progress = new Map(progressResult.docs.map((doc) => [typeof doc.learningItem === "object" ? doc.learningItem.id : doc.learningItem, doc.status]));
  const items: LearningDashboardItem[] = itemResult.docs.filter((doc) => canAccessLearningItem(member, doc as AccessItem, enrollments)).map((doc) => {
    const resource = typeof doc.resource === "object" && doc.resource ? doc.resource : null;
    const file = resource && typeof resource.file === "object" && resource.file ? resource.file : null;
    return { id: doc.id, title: doc.title, summary: doc.summary, programKey: doc.programKey, kind: doc.kind, week: doc.week || 0, order: doc.order || 0, estimatedMinutes: doc.estimatedMinutes || 0, url: doc.externalUrl || (file && "url" in file ? file.url || "" : ""), status: (progress.get(doc.id) || "not-started") as LearningDashboardItem["status"] };
  });
  return { enrollments, items };
}