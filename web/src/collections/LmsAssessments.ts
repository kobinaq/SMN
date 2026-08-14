import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

const staffReadAnswer = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const LmsAssessments: CollectionConfig = {
  slug: "lms-assessments",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "course", "status", "dueAt"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { status: { equals: "published" } } as Where;
      return false;
    },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1, index: true },
    { name: "module", type: "relationship", relationTo: "lms-modules", maxDepth: 0 },
    { name: "lesson", type: "relationship", relationTo: "lms-lessons", maxDepth: 0 },
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, index: true },
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "assignment",
      options: [
        { label: "Assignment", value: "assignment" },
        { label: "Quiz", value: "quiz" },
      ],
    },
    { name: "instructions", type: "textarea", required: true },
    { name: "availableFrom", type: "date" },
    { name: "dueAt", type: "date" },
    { name: "allowLate", type: "checkbox", defaultValue: false },
    { name: "maxAttempts", type: "number", min: 1, defaultValue: 1 },
    { name: "totalMarks", type: "number", min: 0, defaultValue: 0 },
    {
      name: "questions",
      type: "array",
      admin: { condition: (_, siblingData) => siblingData?.kind === "quiz" },
      fields: [
        { name: "prompt", type: "textarea", required: true },
        {
          name: "type",
          type: "select",
          required: true,
          defaultValue: "multiple-choice",
          options: [
            { label: "Multiple choice", value: "multiple-choice" },
            { label: "Short answer", value: "short-answer" },
          ],
        },
        {
          name: "options",
          type: "array",
          fields: [{ name: "option", type: "text", required: true }],
        },
        {
          name: "answer",
          type: "text",
          access: { read: staffReadAnswer },
          admin: { description: "Hidden from learners. Used to auto-score multiple choice." },
        },
        { name: "marks", type: "number", required: true, min: 1, defaultValue: 1 },
      ],
    },
    {
      name: "rubric",
      type: "array",
      admin: {
        description: "Used when staff score assignments and short answers.",
      },
      fields: [
        { name: "criterion", type: "text", required: true },
        { name: "description", type: "textarea" },
        {
          name: "levels",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "descriptor", type: "textarea" },
            { name: "marks", type: "number", required: true, min: 0 },
          ],
        },
      ],
    },
    { name: "order", type: "number", defaultValue: 0 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: ["draft", "published", "archived"],
      admin: { position: "sidebar" },
    },
  ],
};
