import { AIError, type AIProvider, type AIResult, type StreamChunk, type StructuredRequest, type TextRequest } from "./types";

export class MockAIProvider implements AIProvider {
  readonly name = "mock";
  constructor(private readonly responder: (request: TextRequest) => unknown = (request) => {
    const schemaName = (request as TextRequest & { schemaName?: string }).schemaName;
    if (schemaName === "smn_quiz") return { title: "Mock quiz", instructions: "Answer using the course material.", questions: [{ prompt: "What is the key idea?", type: "short-answer", options: [], answer: "The source-supported idea.", rationale: "This checks understanding.", marks: 5 }], totalMarks: 5 };
    if (schemaName === "smn_rubric") return { title: "Mock rubric", criteria: [{ criterion: "Evidence", description: "Uses course evidence.", levels: [{ label: "Developing", descriptor: "Some evidence", marks: 1 }, { label: "Strong", descriptor: "Clear evidence", marks: 3 }] }], totalMarks: 3 };
    if (schemaName === "smn_lesson_outline") return { title: "Mock outline", objectives: ["Apply the key idea"], sections: [{ heading: "Foundation", summary: "Review and apply the approved material.", minutes: 15 }], assessmentIdea: "Explain the idea with an example." };
    return "Mock AI response grounded in the supplied approved context.";
  }) {}
  async generateText(request: TextRequest): Promise<AIResult<string>> { const started = Date.now(); const value = this.responder(request); if (typeof value !== "string") throw new AIError("Mock returned non-text output.", "invalid_output"); return { value, model: request.model || "mock", provider: this.name, usage: {}, latencyMs: Date.now() - started }; }
  async generateStructured<T>(request: StructuredRequest<T>): Promise<AIResult<T>> { const started = Date.now(); const parsed = request.schema.safeParse(this.responder(request)); if (!parsed.success) throw new AIError("Provider output did not match the requested schema.", "invalid_output"); return { value: parsed.data, model: request.model || "mock", provider: this.name, usage: {}, latencyMs: Date.now() - started }; }
  async *streamText(request: TextRequest): AsyncIterable<StreamChunk> { const result = await this.generateText(request); yield { delta: result.value, usage: result.usage }; yield { delta: "", done: true }; }
}
