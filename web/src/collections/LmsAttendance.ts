import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, Where } from "payload";
import { syncCohortCompletion } from "@/lib/lms-cohort";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

function relationID(value: unknown) {
  return value && typeof value === "object" && "id" in value ? (value as { id: string | number }).id : value;
}

const recomputeCompletion: CollectionAfterChangeHook = async ({ doc, req }) => {
  await syncCohortCompletion(req.payload, {
    courseID: relationID(doc.course) as string | number,
    memberID: relationID(doc.member) as string | number,
    req,
  });
  return doc;
};

const recomputeOnDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await syncCohortCompletion(req.payload, {
    courseID: relationID(doc.course) as string | number,
    memberID: relationID(doc.member) as string | number,
    req,
  });
  return doc;
};

/** One row per member per live session — the register that drives cohort completion. */
export const LmsAttendance: CollectionConfig = {
  slug: "lms-attendance",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["member", "session", "course", "status", "updatedAt"],
    group: "Learning",
  },
  access: {
    admin: staffOnly,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { member: { equals: req.user.id } } as Where;
      return false;
    },
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "session", type: "relationship", relationTo: "lms-sessions", required: true, maxDepth: 1, index: true },
    { name: "course", type: "relationship", relationTo: "lms-courses", required: true, maxDepth: 1, index: true },
    { name: "member", type: "relationship", relationTo: "members", required: true, maxDepth: 1, index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "present",
      options: ["present", "late", "excused", "absent"],
    },
    { name: "notes", type: "text" },
  ],
  hooks: { afterChange: [recomputeCompletion], afterDelete: [recomputeOnDelete] },
};
