import type { Payload } from "payload";
import { actorKey, assertAllowedAIAction } from "./runtime";
import { matchOpportunities, type CareerOpportunity, type CareerProfile } from "./career-matching";

const api = (payload: Payload) => payload as unknown as { find(args: unknown): Promise<{ docs: Array<Record<string, unknown>>; totalDocs: number }>; create(args: unknown): Promise<Record<string, unknown>>; update(args: unknown): Promise<Record<string, unknown>>; delete(args: unknown): Promise<unknown> };

export async function getCareerSnapshot(payload: Payload, memberId: string | number) {
  const [member, enrollments, certificates, portfolios, opportunities, courses, state] = await Promise.all([
    payload.findByID({ collection: "members", id: memberId, depth: 0, overrideAccess: true }),
    payload.find({ collection: "enrollments", depth: 0, limit: 200, overrideAccess: true, where: { member: { equals: memberId } } }),
    payload.find({ collection: "certificates", depth: 0, limit: 200, overrideAccess: true, where: { and: [{ member: { equals: memberId } }, { status: { equals: "valid" } }] } }),
    payload.find({ collection: "portfolios", depth: 0, limit: 100, overrideAccess: true, where: { member: { equals: memberId } } }),
    payload.find({ collection: "opportunities", depth: 0, limit: 300, overrideAccess: true, where: { status: { equals: "published" } } }),
    payload.find({ collection: "lms-courses", depth: 0, limit: 200, overrideAccess: true, where: { status: { equals: "published" } } }),
    api(payload).find({ collection: "ai-career-states", depth: 0, limit: 1, overrideAccess: true, where: { member: { equals: memberId } } }),
  ]);
  const enrolledKeys = new Set(enrollments.docs.filter(item => ["active", "completed"].includes(item.status)).map(item => item.programKey));
  const learning = courses.docs.filter(course => course.accessRule === "member" || enrolledKeys.has(course.programKey)).map(course => course.title);
  const profile: CareerProfile = { headline: member.headline, bio: member.bio, location: member.location, skills: ((member as unknown as { skills?: Array<{ skill?: string }> }).skills || []).map(item => item.skill || "").filter(Boolean), learning, certificates: certificates.docs.map(item => item.programName), portfolioSkills: portfolios.docs.flatMap(item => (item.skills || []).map(skill => skill.skill)), goals: String(state.docs[0]?.goalSummary || (member as unknown as { careerGoals?: string }).careerGoals || "") };
  const matches = matchOpportunities(profile, opportunities.docs as unknown as CareerOpportunity[]).slice(0, 20);
  return { profile, matches, learning: courses.docs.filter(course => !enrolledKeys.has(course.programKey)).slice(0, 12).map(course => ({ id: course.id, title: course.title, slug: course.slug, summary: course.summary })), certificates: certificates.docs.map(item => ({ id: item.id, title: item.title, code: item.credentialCode })), portfolios: portfolios.docs.filter(item => item.status === "published").map(item => ({ id: item.id, title: item.title, slug: item.slug, summary: item.summary })), state: state.docs[0] || null };
}

export async function saveCareerState(payload: Payload, memberId: string | number, field: "goalSummary" | "confirmedPlan", value: unknown, confirmed: boolean) {
  assertAllowedAIAction(field === "goalSummary" ? "save_goal" : "save_plan", confirmed); const current = await api(payload).find({ collection: "ai-career-states", depth: 0, limit: 1, overrideAccess: true, where: { member: { equals: memberId } } });
  if (current.docs[0]) return api(payload).update({ collection: "ai-career-states", id: current.docs[0].id, overrideAccess: true, data: { [field]: value, retentionConsentAt: new Date().toISOString() } });
  return api(payload).create({ collection: "ai-career-states", overrideAccess: true, data: { member: memberId, [field]: value, retentionConsentAt: new Date().toISOString() } });
}

export async function resetCareerData(payload: Payload, memberId: string | number, includeFeedback = false) {
  await api(payload).delete({ collection: "ai-career-states", overrideAccess: true, where: { member: { equals: memberId } } });
  if (includeFeedback) { await api(payload).delete({ collection: "ai-feedback", overrideAccess: true, where: { member: { equals: memberId } } }); await api(payload).delete({ collection: "ai-usage-records", overrideAccess: true, where: { actorKey: { equals: actorKey({ collection: "members", id: memberId }) } } }); }
}

export const careerToolNames = ["get_profile_summary", "get_learning", "get_completions", "get_certificates", "get_public_portfolios", "get_published_opportunities", "get_courses", "save_confirmed_goal", "save_confirmed_plan"] as const;
