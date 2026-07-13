import type { CollectionConfig, Where } from "payload";
import { canStaff } from "@/lib/staff-permissions";

const staff = ({ req }: { req: { user?: { collection?: string; role?: string | null } | null } }) => canStaff(req.user as never, "learning", "support", "analyst");
const learning = ({ req }: { req: { user?: { collection?: string; role?: string | null } | null } }) => canStaff(req.user as never, "learning");
const memberOwned = ({ req }: { req: { user?: { collection?: string; id?: string | number } | null } }) => req.user?.collection === "members" ? { member: { equals: req.user.id } } as Where : staff({ req } as never);

export const AIUsageRecords: CollectionConfig = {
  slug: "ai-usage-records",
  admin: { useAsTitle: "feature", defaultColumns: ["feature", "actorType", "status", "provider", "model", "latencyMs", "createdAt"], group: "System" },
  access: { admin: staff, read: staff, create: () => false, update: () => false, delete: ({ req }) => canStaff(req.user as never) },
  fields: [
    { name: "actorType", type: "select", required: true, options: ["member", "staff", "system"], index: true },
    { name: "actorKey", type: "text", required: true, index: true, admin: { description: "Opaque actor identifier; never email or display name." } },
    { name: "feature", type: "select", required: true, options: ["tutor", "content-studio", "career-coach", "retrieval", "tool"], index: true },
    { name: "operation", type: "text", required: true, index: true },
    { name: "provider", type: "text" }, { name: "model", type: "text" },
    { name: "status", type: "select", required: true, options: ["success", "declined", "error", "timeout", "limited"], index: true },
    { name: "inputChars", type: "number", min: 0 }, { name: "outputChars", type: "number", min: 0 },
    { name: "inputTokens", type: "number", min: 0 }, { name: "outputTokens", type: "number", min: 0 },
    { name: "latencyMs", type: "number", min: 0 }, { name: "sourceCount", type: "number", min: 0 },
    { name: "promptHash", type: "text", index: true }, { name: "errorCode", type: "text", index: true },
    { name: "expiresAt", type: "date", required: true, index: true },
  ],
};

export const AIFeedback: CollectionConfig = {
  slug: "ai-feedback",
  admin: { useAsTitle: "feature", defaultColumns: ["feature", "rating", "reason", "createdAt"], group: "System" },
  access: { admin: staff, read: memberOwned, create: () => false, update: () => false, delete: ({ req }) => canStaff(req.user as never) },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, index: true, maxDepth: 0 },
    { name: "feature", type: "select", required: true, options: ["tutor", "content-studio", "career-coach"], index: true },
    { name: "contextKey", type: "text", index: true }, { name: "rating", type: "select", required: true, options: ["helpful", "not-helpful"] },
    { name: "reason", type: "select", options: ["incorrect", "unsupported", "unclear", "unsafe", "irrelevant", "other"] },
    { name: "comment", type: "textarea", maxLength: 1000 },
  ],
};

export const AIKnowledgeSources: CollectionConfig = {
  slug: "ai-knowledge-sources",
  admin: { useAsTitle: "title", defaultColumns: ["title", "course", "lesson", "kind", "approved", "updatedAt"], group: "Learning" },
  access: { admin: learning, read: learning, create: learning, update: learning, delete: learning },
  fields: [
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, index: true, maxDepth: 1 },
    { name: "lesson", type: "relationship", relationTo: "lms-lessons", index: true, maxDepth: 1 },
    { name: "kind", type: "select", required: true, options: ["transcript", "note", "resource", "faq", "attachment-text"], index: true },
    { name: "title", type: "text", required: true }, { name: "content", type: "textarea", required: true, maxLength: 100000 },
    { name: "citationLabel", type: "text", required: true }, { name: "approved", type: "checkbox", defaultValue: false, index: true },
    { name: "reviewedBy", type: "relationship", relationTo: "users", maxDepth: 0 }, { name: "reviewedAt", type: "date" },
  ],
};

export const AIDrafts: CollectionConfig = {
  slug: "ai-drafts",
  admin: { useAsTitle: "title", defaultColumns: ["title", "kind", "course", "status", "version", "createdBy", "updatedAt"], group: "Learning" },
  access: { admin: learning, read: learning, create: learning, update: learning, delete: learning },
  fields: [
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, index: true, maxDepth: 1 },
    { name: "lesson", type: "relationship", relationTo: "lms-lessons", index: true, maxDepth: 1 },
    { name: "kind", type: "select", required: true, options: ["course-outline", "lesson-outline", "lesson", "example", "quiz", "rubric", "revision", "faq"], index: true },
    { name: "title", type: "text", required: true }, { name: "content", type: "json", required: true },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: ["draft", "selected", "rejected", "saved"], index: true },
    { name: "version", type: "number", required: true, min: 1, defaultValue: 1 }, { name: "parentDraft", type: "relationship", relationTo: "ai-drafts", maxDepth: 0 },
    { name: "createdBy", type: "relationship", relationTo: "users", required: true, maxDepth: 0 },
    { name: "provenance", type: "json", required: true, admin: { readOnly: true } }, { name: "controls", type: "json" },
  ],
};

export const AICareerStates: CollectionConfig = {
  slug: "ai-career-states",
  admin: { useAsTitle: "id", defaultColumns: ["member", "updatedAt"], group: "Members" },
  access: { admin: staff, read: memberOwned, create: memberOwned, update: memberOwned, delete: memberOwned },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, unique: true, index: true, maxDepth: 0 },
    { name: "goalSummary", type: "textarea", maxLength: 5000 }, { name: "confirmedPlan", type: "json" },
    { name: "savedOpportunityIds", type: "json" }, { name: "savedCourseIds", type: "json" },
    { name: "conversationSummary", type: "textarea", maxLength: 10000 }, { name: "retentionConsentAt", type: "date" },
  ],
};

export const AICollections = [AIUsageRecords, AIFeedback, AIKnowledgeSources, AIDrafts, AICareerStates];
