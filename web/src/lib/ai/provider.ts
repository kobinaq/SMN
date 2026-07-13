import { getAIConfig } from "./config";
import { GroqAIProvider } from "./groq-provider";
import { MockAIProvider } from "./mock-provider";
import { AIError, type AIProvider } from "./types";

export function getAIProvider(): AIProvider {
  const config = getAIConfig();
  if (config.provider === "mock") return new MockAIProvider();
  if (config.provider === "groq" && config.apiKey) return new GroqAIProvider(config.apiKey, config.models.text, config.timeoutMs);
  throw new AIError("AI is not configured for this environment.", "disabled");
}
