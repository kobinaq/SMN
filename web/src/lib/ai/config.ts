import { AIError } from "./types";

export type AIModelPurpose = "text" | "structured" | "fast";
export type AIFeatureFlag = "tutor" | "content-studio" | "career-coach";
export type AIConfig = { provider: "groq" | "mock" | "disabled"; apiKey?: string; models: Record<AIModelPurpose, string>; timeoutMs: number; maxInputChars: number; hourlyRequests: number; retentionDays: number };

const featureEnv: Record<AIFeatureFlag, string> = {
  tutor: "AI_TUTOR_ENABLED",
  "content-studio": "AI_CONTENT_STUDIO_ENABLED",
  "career-coach": "AI_CAREER_COACH_ENABLED",
};

/** True when the feature env var is set to true (trimmed, case-insensitive). */
export function isAIFeatureEnabled(feature: AIFeatureFlag) {
  return process.env[featureEnv[feature]]?.trim().toLowerCase() === "true";
}

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || (process.env.GROQ_API_KEY ? "groq" : "disabled")) as AIConfig["provider"];
  if (!(["groq", "mock", "disabled"] as const).includes(provider)) throw new AIError("AI_PROVIDER must be groq, mock, or disabled.", "disabled");
  return {
    provider,
    apiKey: process.env.GROQ_API_KEY,
    models: {
      text: process.env.AI_TEXT_MODEL || "llama-3.3-70b-versatile",
      structured: process.env.AI_STRUCTURED_MODEL || "openai/gpt-oss-20b",
      fast: process.env.AI_FAST_MODEL || "llama-3.1-8b-instant",
    },
    timeoutMs: Math.min(60_000, Math.max(2_000, Number(process.env.AI_TIMEOUT_MS || 20_000))),
    maxInputChars: Math.min(40_000, Math.max(500, Number(process.env.AI_MAX_INPUT_CHARS || 12_000))),
    hourlyRequests: Math.min(200, Math.max(1, Number(process.env.AI_HOURLY_REQUESTS || 30))),
    retentionDays: Math.min(365, Math.max(1, Number(process.env.AI_USAGE_RETENTION_DAYS || 30))),
  };
}
