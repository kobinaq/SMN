import { createHash } from "node:crypto";
import type { Payload } from "payload";
import type { z } from "zod";
import { getAIConfig } from "./config";
import { getAIProvider } from "./provider";
import { AIError, type AIMessage, type AIResult } from "./types";

export type AIFeature = "tutor" | "content-studio" | "career-coach" | "retrieval" | "tool";
export type AIActor = { collection: "members" | "users"; id: string | number };
const prohibitedActions = new Set(["publish_content", "publish_course", "issue_certificate", "grade_assignment", "decide_mentor", "apply_opportunity", "employment_decision", "change_protected_member_data"]);
const injectionPatterns = [
  /ignore\s+(all\s+)?(previous|prior|system)(\s+(previous|prior|system))*\s+instructions/i,
  /reveal\s+(the\s+)?((system|developer)\s+)?prompt/i,
  /act\s+as\s+(the\s+)?system/i,
  /<\/?(system|assistant|tool)>/i,
];

const db = (payload: Payload) => payload as unknown as { find(args: unknown): Promise<{ totalDocs: number }>; create(args: unknown): Promise<unknown>; delete(args: unknown): Promise<unknown> };
export function actorKey(actor: AIActor) { return createHash("sha256").update(`${process.env.PAYLOAD_SECRET || "local"}:${actor.collection}:${actor.id}`).digest("hex").slice(0, 32); }
export function promptHash(messages: AIMessage[]) { return createHash("sha256").update(messages.map(message => `${message.role}:${message.content}`).join("\n")).digest("hex"); }

export function validateAIInput(input: string) {
  const value = input.trim(); const config = getAIConfig();
  if (!value) throw new AIError("Enter a question or instruction.", "policy");
  if (value.length > config.maxInputChars) throw new AIError(`Input exceeds the ${config.maxInputChars}-character limit.`, "policy");
  if (injectionPatterns.some(pattern => pattern.test(value))) throw new AIError("This request contains instruction-override language and was not sent to the AI provider.", "policy");
  return value;
}

export function assertAllowedAIAction(action: string, confirmed = false) {
  if (prohibitedActions.has(action)) throw new AIError("AI is not permitted to perform this action.", "policy");
  if (["save_goal", "save_plan"].includes(action) && !confirmed) throw new AIError("Saving a goal or plan requires explicit confirmation.", "policy");
}

async function enforceRateLimit(payload: Payload, actor: AIActor) {
  const config = getAIConfig(); const since = new Date(Date.now() - 3_600_000).toISOString();
  const records = await db(payload).find({ collection: "ai-usage-records", depth: 0, limit: 0, overrideAccess: true, where: { and: [{ actorKey: { equals: actorKey(actor) } }, { createdAt: { greater_than_equal: since } }] } });
  if (records.totalDocs >= config.hourlyRequests) throw new AIError("AI request limit reached. Try again later.", "rate_limit", true);
}

type UsageContext = { payload: Payload; actor: AIActor; feature: AIFeature; operation: string; inputChars: number; sourceCount?: number };
export type AIEventStatus = "success" | "declined" | "error" | "timeout" | "limited";
async function recordUsage(context: UsageContext, result: AIResult<unknown> | null, status: AIEventStatus, errorCode?: string, hash?: string) {
  const retention = getAIConfig().retentionDays * 86_400_000;
  await db(context.payload).create({ collection: "ai-usage-records", overrideAccess: true, data: { actorType: context.actor.collection === "members" ? "member" : "staff", actorKey: actorKey(context.actor), feature: context.feature, operation: context.operation, provider: result?.provider, model: result?.model, status, inputChars: context.inputChars, outputChars: typeof result?.value === "string" ? result.value.length : result ? JSON.stringify(result.value).length : 0, inputTokens: result?.usage.inputTokens, outputTokens: result?.usage.outputTokens, latencyMs: result?.latencyMs, sourceCount: context.sourceCount || 0, promptHash: hash, errorCode, expiresAt: new Date(Date.now() + retention).toISOString() } }).catch(() => undefined);
}

/** Records a privacy-minimized product event without storing prompt or response content. */
export async function recordAIEvent(context: UsageContext, status: AIEventStatus, errorCode?: string) {
  await recordUsage(context, null, status, errorCode);
}

export async function runAIText(context: UsageContext & { messages: AIMessage[]; model?: string; maxTokens?: number }) {
  const hash = promptHash(context.messages);
  try { await enforceRateLimit(context.payload, context.actor); const result = await getAIProvider().generateText({ messages: context.messages, model: context.model, maxTokens: context.maxTokens, timeoutMs: getAIConfig().timeoutMs }); await recordUsage(context, result, "success", undefined, hash); return result; }
  catch (error) { const aiError = error instanceof AIError ? error : new AIError("AI request failed.", "provider", true); await recordUsage(context, null, aiError.code === "timeout" ? "timeout" : aiError.code === "rate_limit" ? "limited" : aiError.code === "policy" ? "declined" : "error", aiError.code, hash); throw aiError; }
}

export async function runAIStructured<T>(context: UsageContext & { messages: AIMessage[]; schema: z.ZodType<T>; jsonSchema: Record<string, unknown>; schemaName: string; model?: string; maxTokens?: number }) {
  const hash = promptHash(context.messages);
  try { await enforceRateLimit(context.payload, context.actor); const result = await getAIProvider().generateStructured({ messages: context.messages, schema: context.schema, jsonSchema: context.jsonSchema, schemaName: context.schemaName, model: context.model || getAIConfig().models.structured, maxTokens: context.maxTokens, timeoutMs: getAIConfig().timeoutMs }); await recordUsage(context, result, "success", undefined, hash); return result; }
  catch (error) { const aiError = error instanceof AIError ? error : new AIError("AI request failed.", "provider", true); await recordUsage(context, null, aiError.code === "timeout" ? "timeout" : aiError.code === "rate_limit" ? "limited" : aiError.code === "policy" ? "declined" : "error", aiError.code, hash); throw aiError; }
}

export async function deleteExpiredAIUsage(payload: Payload) { return db(payload).delete({ collection: "ai-usage-records", overrideAccess: true, where: { expiresAt: { less_than_equal: new Date().toISOString() } } }); }
