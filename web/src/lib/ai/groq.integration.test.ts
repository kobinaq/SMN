import { describe, expect, it } from "vitest";
import { GroqAIProvider } from "./groq-provider";

const enabled = process.env.RUN_GROQ_INTEGRATION === "true" && Boolean(process.env.GROQ_API_KEY);

describe.skipIf(!enabled)("Groq integration (explicit opt-in)", () => {
  it("returns a minimal text completion", async () => {
    const provider = new GroqAIProvider(process.env.GROQ_API_KEY!, process.env.AI_FAST_MODEL || "llama-3.1-8b-instant", 20_000);
    const result = await provider.generateText({ messages: [{ role: "user", content: "Reply with exactly: ready" }], maxTokens: 8, temperature: 0 });
    expect(result.value.toLowerCase()).toContain("ready");
  });
});
