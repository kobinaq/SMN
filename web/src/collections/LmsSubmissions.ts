import type { CollectionConfig, Where } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const LmsSubmissions: CollectionConfig = {
  slug: "lms-submissions",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["assessment", "member", "status", "attemptNumber", "score", "updatedAt"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") {
        return { member: { equals: req.user.id } } as Where;
      }
      return false;
    },
    create: ({ req }) => Boolean(req.user && (req.user.collection === "users" || req.user.collection === "members")),
    update: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") {
        return { and: [{ member: { equals: req.user.id } }, { status: { equals: "in-progress" } }] } as Where;
      }
      return false;
    },
    delete: staffOnly,
  },
  fields: [
    { name: "assessment", type: "relationship", relationTo: "lms-assessments", required: true, maxDepth: 1, index: true },
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 0, index: true },
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1, index: true },
    { name: "attemptNumber", type: "number", required: true, min: 1, defaultValue: 1 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "in-progress",
      options: [
        { label: "In progress", value: "in-progress" },
        { label: "Submitted", value: "submitted" },
        { label: "Graded", value: "graded" },
        { label: "Returned", value: "returned" },
      ],
    },
    { name: "answers", type: "json" },
    { name: "textResponse", type: "textarea" },
    {
      name: "files",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "file", type: "upload", relationTo: "media", required: true },
      ],
    },
    { name: "late", type: "checkbox", defaultValue: false },
    { name: "submittedAt", type: "date" },
    { name: "score", type: "number", min: 0 },
    { name: "maxScore", type: "number", min: 0 },
    { name: "feedback", type: "textarea" },
    {
      name: "rubricScores",
      type: "array",
      fields: [
        { name: "criterion", type: "text", required: true },
        { name: "marks", type: "number", required: true, min: 0 },
        { name: "comment", type: "textarea" },
      ],
    },
    { name: "gradedBy", type: "relationship", relationTo: "users", maxDepth: 0 },
    { name: "gradedAt", type: "date" },
  ],
};
