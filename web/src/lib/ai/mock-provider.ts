import { AIError, type AIProvider, type AIResult, type StreamChunk, type StructuredRequest, type TextRequest } from "./types";

export class MockAIProvider implements AIProvider {
  readonly name = "mock";
  constructor(private readonly responder: (request: TextRequest) => unknown = () => "Mock AI response") {}
  async generateText(request: TextRequest): Promise<AIResult<string>> { const started = Date.now(); const value = this.responder(request); if (typeof value !== "string") throw new AIError("Mock returned non-text output.", "invalid_output"); return { value, model: request.model || "mock", provider: this.name, usage: {}, latencyMs: Date.now() - started }; }
  async generateStructured<T>(request: StructuredRequest<T>): Promise<AIResult<T>> { const started = Date.now(); const parsed = request.schema.safeParse(this.responder(request)); if (!parsed.success) throw new AIError("Provider output did not match the requested schema.", "invalid_output"); return { value: parsed.data, model: request.model || "mock", provider: this.name, usage: {}, latencyMs: Date.now() - started }; }
  async *streamText(request: TextRequest): AsyncIterable<StreamChunk> { const result = await this.generateText(request); yield { delta: result.value, usage: result.usage }; yield { delta: "", done: true }; }
}
