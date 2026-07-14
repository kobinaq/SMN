import { z } from "zod";

export const lessonOutlineSchema = z.object({
  title: z.string().min(1).max(200),
  objectives: z.array(z.string().min(1).max(300)).min(1).max(12),
  sections: z
    .array(
      z.object({
        heading: z.string().min(1).max(200),
        summary: z.string().min(1).max(1000),
        minutes: z.number().int().min(1).max(240),
      }),
    )
    .min(1)
    .max(20),
  assessmentIdea: z.string().min(1).max(1000),
});

export const courseOutlineSchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(2000),
  programKeyHint: z.string().min(1).max(120).optional(),
  level: z.enum(["foundation", "intermediate", "advanced"]).optional(),
  learningOutcomes: z.array(z.string().min(1).max(300)).min(1).max(12),
  modules: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        summary: z.string().min(1).max(1000).optional(),
        lessons: z
          .array(
            z.object({
              title: z.string().min(1).max(200),
              summary: z.string().min(1).max(1000),
              lessonType: z.enum(["video", "reading", "download", "assignment"]).optional(),
              durationMinutes: z.number().int().min(0).max(480).optional(),
              body: z.string().max(8000).optional(),
            }),
          )
          .min(1)
          .max(8),
      }),
    )
    .min(1)
    .max(6),
});

export const quizSchema = z.object({
  title: z.string().min(1).max(200),
  instructions: z.string().min(1).max(1000),
  questions: z
    .array(
      z.object({
        prompt: z.string().min(1).max(1000),
        type: z.enum(["multiple-choice", "short-answer", "scenario"]),
        options: z.array(z.string().max(500)).max(8),
        answer: z.string().min(1).max(1000),
        rationale: z.string().min(1).max(1000),
        marks: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(30),
  totalMarks: z.number().int().min(1).max(1000),
});

export const rubricSchema = z.object({
  title: z.string().min(1).max(200),
  criteria: z
    .array(
      z.object({
        criterion: z.string().min(1).max(200),
        description: z.string().min(1).max(1000),
        levels: z
          .array(
            z.object({
              label: z.string().min(1).max(100),
              descriptor: z.string().min(1).max(1000),
              marks: z.number().int().min(0).max(100),
            }),
          )
          .min(2)
          .max(8),
      }),
    )
    .min(1)
    .max(20),
  totalMarks: z.number().int().min(1).max(1000),
});

export const lessonOutlineJSONSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "objectives", "sections", "assessmentIdea"],
  properties: {
    title: { type: "string" },
    objectives: { type: "array", items: { type: "string" } },
    sections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["heading", "summary", "minutes"],
        properties: {
          heading: { type: "string" },
          summary: { type: "string" },
          minutes: { type: "integer" },
        },
      },
    },
    assessmentIdea: { type: "string" },
  },
};

export const courseOutlineJSONSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "learningOutcomes", "modules"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    programKeyHint: { type: "string" },
    level: { type: "string", enum: ["foundation", "intermediate", "advanced"] },
    learningOutcomes: { type: "array", items: { type: "string" } },
    modules: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "lessons"],
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          lessons: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "summary"],
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                lessonType: { type: "string", enum: ["video", "reading", "download", "assignment"] },
                durationMinutes: { type: "integer" },
                body: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

export const quizJSONSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "instructions", "questions", "totalMarks"],
  properties: {
    title: { type: "string" },
    instructions: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["prompt", "type", "options", "answer", "rationale", "marks"],
        properties: {
          prompt: { type: "string" },
          type: { type: "string", enum: ["multiple-choice", "short-answer", "scenario"] },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "string" },
          rationale: { type: "string" },
          marks: { type: "integer" },
        },
      },
    },
    totalMarks: { type: "integer" },
  },
};

export const rubricJSONSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "criteria", "totalMarks"],
  properties: {
    title: { type: "string" },
    criteria: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["criterion", "description", "levels"],
        properties: {
          criterion: { type: "string" },
          description: { type: "string" },
          levels: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "descriptor", "marks"],
              properties: {
                label: { type: "string" },
                descriptor: { type: "string" },
                marks: { type: "integer" },
              },
            },
          },
        },
      },
    },
    totalMarks: { type: "integer" },
  },
};
