import { APIError, type CollectionBeforeValidateHook, type CollectionConfig } from "payload";
import {
  deriveEnrollmentDefaults,
  refId,
  validateEnrollmentOffering,
  type EnrollmentOfferingData,
} from "@/lib/enrollments/offering";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) => req.user?.collection === "users";

const applyOffering: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data;
  const merged = { ...(originalDoc ?? {}), ...data } as EnrollmentOfferingData;
  const result = validateEnrollmentOffering(merged);
  if (result !== true) throw new APIError(result, 400, undefined, true);

  const cohortId = refId(merged.cohort);
  const cohort =
    merged.offering === "cohort" && cohortId != null
      ? await req.payload.findByID({ collection: "cohorts", id: cohortId, depth: 0, overrideAccess: true, req })
      : null;
  const patch = deriveEnrollmentDefaults(merged, cohort ? { id: cohort.id, name: cohort.name, course: cohort.course } : null);
  return { ...data, ...patch };
};

export const Enrollments: CollectionConfig = {
  slug: "enrollments",
  admin: { useAsTitle: "programName", defaultColumns: ["member", "programName", "offering", "programType", "status", "updatedAt"], group: "Learning" },
  access: {
    admin: staffOnly,
    read: ({ req }) => req.user?.collection === "users" ? true : req.user?.collection === "members" ? { member: { equals: req.user.id } } : false,
    create: staffOnly, update: staffOnly, delete: staffOnly,
  },
  hooks: { beforeValidate: [applyOffering] },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    {
      name: "offering",
      type: "select",
      index: true,
      options: [
        { label: "Cohort", value: "cohort" },
        { label: "One-on-One", value: "one-on-one" },
      ],
      admin: { description: "New model. Leave blank for legacy enrollments that use programKey only." },
    },
    { name: "cohort", type: "relationship", relationTo: "cohorts", index: true, maxDepth: 1, admin: { condition: (data) => data?.offering === "cohort" } },
    { name: "catalogCourse", type: "relationship", relationTo: "courses", index: true, maxDepth: 1, admin: { description: "Derived from the cohort when blank." } },
    { name: "trainer", type: "relationship", relationTo: "users", maxDepth: 0, admin: { condition: (data) => data?.offering === "one-on-one" } },
    { name: "payment", type: "relationship", relationTo: "payments", maxDepth: 0 },
    { name: "sourceEnquiry", type: "relationship", relationTo: "enquiries", maxDepth: 0 },
    { name: "programName", type: "text", required: true },
    { name: "programKey", type: "text", required: true, index: true, admin: { description: "Stable key shared with the LMS course, e.g. cohort-2026 or ai-marketers." } },
    { name: "course", type: "relationship", relationTo: "lms-courses", maxDepth: 1, index: true },
    { name: "programType", type: "select", required: true, options: ["Cohort", "One-on-One", "Self-paced course", "Workshop", "Community track"] },
    { name: "source", type: "select", required: true, defaultValue: "staff", options: [
      { label: "Staff grant", value: "staff" },
      { label: "Cohort intake", value: "cohort" },
      { label: "Paystack purchase", value: "paystack" },
      { label: "Selar purchase (legacy)", value: "selar" },
      { label: "Converted enquiry", value: "enquiry" },
    ] },
    { name: "externalReference", type: "text", admin: { description: "Paystack reference or legacy order id." } },
    { name: "status", type: "select", required: true, defaultValue: "active", options: ["active", "completed", "paused", "cancelled"] },
    { name: "classroomUrl", type: "text", admin: { description: "Google Classroom / live class link." } },
    { name: "courseUrl", type: "text", admin: { description: "Optional external learning URL." } },
    { name: "startsAt", type: "date" },
    { name: "endsAt", type: "date" },
    { name: "startedAt", type: "date", admin: { readOnly: true } },
    { name: "lastActivityAt", type: "date", admin: { readOnly: true } },
    { name: "completedAt", type: "date", admin: { readOnly: true } },
    { name: "completionPercent", type: "number", min: 0, max: 100, defaultValue: 0, admin: { readOnly: true } },
    { name: "certificateEligible", type: "checkbox", defaultValue: false, admin: { readOnly: true } },
  ],
};
