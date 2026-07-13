import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { getCareerSnapshot, resetCareerData, saveCareerState } from "@/lib/ai/career-tools";
import { recordAIEvent, runAIText, validateAIInput } from "@/lib/ai/runtime";
import { AIError } from "@/lib/ai/types";
import { memberAuthHeaders } from "@/lib/auth/member";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("explain-match"), opportunityId: z.union([z.string(), z.number()]) }),
  z.object({ action: z.literal("chat"), message: z.string().min(1).max(12000) }),
  z.object({ action: z.literal("save-goal"), goal: z.string().trim().min(3).max(5000), confirmed: z.literal(true) }),
  z.object({ action: z.literal("save-plan"), plan: z.unknown(), confirmed: z.literal(true) }),
  z.object({ action: z.enum(["reset", "delete-data"]), confirmed: z.literal(true) }),
]);

export async function POST(request: Request) {
  if (process.env.AI_CAREER_COACH_ENABLED !== "true") return Response.json({ error: "AI Career Coach is not enabled." }, { status: 503 });
  const payload = await getPayloadClient(); const { user } = await payload.auth({ headers: await memberAuthHeaders() });
  if (!user || user.collection !== "members") return Response.json({ error: "Member sign-in required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return Response.json({ error: "Invalid Career Coach request." }, { status: 400 });
  const event = { payload, actor: { collection: "members" as const, id: user.id }, feature: "career-coach" as const, inputChars: 0 };
  if (parsed.data.action === "save-goal") { await saveCareerState(payload, user.id, "goalSummary", parsed.data.goal, parsed.data.confirmed); await recordAIEvent({ ...event, operation: "save-goal", inputChars: parsed.data.goal.length }, "success"); return Response.json({ ok: true }); }
  if (parsed.data.action === "save-plan") { await saveCareerState(payload, user.id, "confirmedPlan", parsed.data.plan, parsed.data.confirmed); await recordAIEvent({ ...event, operation: "save-plan" }, "success"); return Response.json({ ok: true }); }
  if (parsed.data.action === "reset" || parsed.data.action === "delete-data") { await resetCareerData(payload, user.id, parsed.data.action === "delete-data"); if (parsed.data.action === "reset") await recordAIEvent({ ...event, operation: "reset" }, "success"); return Response.json({ ok: true }); }
  try {
    const snapshot = await getCareerSnapshot(payload, user.id); let prompt: string; let operation: string;
    if (parsed.data.action === "explain-match") { const match = snapshot.matches.find(item => String(item.id) === String(parsed.data.opportunityId)); if (!match) return Response.json({ error: "Opportunity is no longer available." }, { status: 404 }); operation = "explain-match"; prompt = `Explain this deterministic opportunity match transparently. Score: ${match.score}/100. Role: ${match.title} at ${match.company}. Evidence matches: ${match.matches.join(", ") || "none"}. Potential gaps: ${match.gaps.join(", ") || "not identified"}. Relevant learning: ${match.relevantLearning.join(", ") || "none identified"}. Never promise an interview, offer, or employment outcome. Clearly distinguish evidence from suggestions.`; }
    else { const message = validateAIInput(parsed.data.message); operation = "conversation"; prompt = `Member question: ${message}\nMinimized member context: ${JSON.stringify({ headline: snapshot.profile.headline, skills: snapshot.profile.skills, goals: snapshot.profile.goals, learning: snapshot.profile.learning, certificates: snapshot.profile.certificates, portfolioSkills: snapshot.profile.portfolioSkills, topMatches: snapshot.matches.slice(0, 5).map(item => ({ title: item.title, company: item.company, score: item.score, matches: item.matches, gaps: item.gaps })) })}\nGive specific, realistic guidance. Never guarantee employment, auto-apply, or claim access to data not shown. Recommend a confirmed save when a goal or plan should persist, but do not save it yourself.`; }
    const result = await runAIText({ payload, actor: { collection: "members", id: user.id }, feature: "career-coach", operation, inputChars: prompt.length, messages: [{ role: "system", content: "You are the SMN AI Career Coach. Be transparent, encouraging, evidence-based, and concise. Recommendations are guidance, not employment decisions or guarantees." }, { role: "user", content: prompt }], maxTokens: 1200 });
    return Response.json({ answer: result.value, notice: "AI guidance can be wrong and does not guarantee employment outcomes." });
  } catch (error) { const safe = error instanceof AIError ? error : new AIError("Career Coach is unavailable.", "provider", true); return Response.json({ error: safe.message, code: safe.code }, { status: safe.code === "rate_limit" ? 429 : safe.code === "policy" ? 400 : 503 }); }
}
