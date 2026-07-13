import type { z } from "zod";

export type AIMessage = { role: "system" | "user" | "assistant"; content: string };
export type AIUsage = { inputTokens?: number; outputTokens?: number; totalTokens?: number };
export type AIResult<T = string> = { value: T; model: string; provider: string; usage: AIUsage; latencyMs: number; finishReason?: string };
export type AIToolDefinition = { name: string; description: string; inputSchema: Record<string, unknown> };
export type AIToolCall = { id: string; name: string; arguments: unknown };

export type TextRequest = { messages: AIMessage[]; model?: string; temperature?: number; maxTokens?: number; timeoutMs?: number; tools?: AIToolDefinition[] };
export type StructuredRequest<T> = TextRequest & { schema: z.ZodType<T>; jsonSchema: Record<string, unknown>; schemaName: string };
export type StreamChunk = { delta: string; usage?: AIUsage; done?: boolean };

export interface AIProvider {
  readonly name: string;
  generateText(request: TextRequest): Promise<AIResult<string>>;
  generateStructured<T>(request: StructuredRequest<T>): Promise<AIResult<T>>;
  streamText(request: TextRequest): AsyncIterable<StreamChunk>;
}

export class AIError extends Error {
  constructor(message: string, public readonly code: "disabled" | "timeout" | "rate_limit" | "provider" | "invalid_output" | "policy" | "unauthorized", public readonly retryable = false) { super(message); this.name = "AIError"; }
}
