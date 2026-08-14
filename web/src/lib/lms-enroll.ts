import type { Payload } from "payload";

export type EnrollmentSource = "staff" | "cohort" | "paystack" | "selar";

type CourseLike = {
  id: string | number;
  title?: string | null;
  programKey?: string | null;
  slug?: string | null;
  delivery?: string | null;
  classroomUrl?: string | null;
};

function relationId(value: unknown): string {
  if (value && typeof value === "object" && "id" in value) {
    return String((value as { id: string | number }).id);
  }
  return value == null ? "" : String(value);
}

function numericRel(value: string | number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("Invalid record id.");
  return n;
}

function savedId(value: unknown): string | number {
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id: unknown }).id;
    if (typeof id === "number" || typeof id === "string") return id;
  }
  throw new Error("Enrollment was not saved.");
}

export function programTypeForDelivery(delivery: string | null | undefined) {
  return delivery === "cohort" ? ("Cohort" as const) : ("Self-paced course" as const);
}

export async function grantCourseEnrollment(
  payload: Payload,
  args: {
    memberId: string | number;
    course: CourseLike;
    source: EnrollmentSource;
    externalReference?: string;
    classroomUrl?: string;
  },
) {
  const memberId = numericRel(args.memberId);
  const courseId = numericRel(args.course.id);
  const programKey = String(args.course.programKey || args.course.slug || args.course.id);
  const classroomUrl = args.classroomUrl || args.course.classroomUrl || "";
  const prior = await payload.find({
    collection: "enrollments",
    limit: 1,
    depth: 0,
    overrideAccess: true,
    where: {
      or: [
        {
          and: [{ member: { equals: memberId } }, { course: { equals: courseId } }],
        },
        {
          and: [{ member: { equals: memberId } }, { programKey: { equals: programKey } }],
        },
      ],
    },
  });

  const data = {
    member: memberId,
    programName: String(args.course.title || "Programme"),
    programKey,
    programType: programTypeForDelivery(args.course.delivery),
    source: args.source,
    status: "active" as const,
    course: courseId,
    classroomUrl: classroomUrl || undefined,
    externalReference: args.externalReference,
    startedAt: new Date().toISOString(),
  };

  const existing = prior.docs[0];
  const enrollment = existing
    ? await payload.update({
        collection: "enrollments",
        id: existing.id,
        overrideAccess: true,
        data: {
          status: "active",
          source: args.source,
          course: courseId,
          classroomUrl: classroomUrl || existing.classroomUrl || undefined,
          externalReference: args.externalReference || existing.externalReference || undefined,
        },
      })
    : await payload.create({
        collection: "enrollments",
        overrideAccess: true,
        data,
      });

  if (args.course.delivery === "cohort") {
    await payload.update({
      collection: "members",
      id: memberId,
      overrideAccess: true,
      data: { cohortStatus: "active" },
    });
  }

  return { id: savedId(enrollment) };
}

export function memberHasEnrollment(
  enrollments: Array<{ status: string; course?: unknown; programKey?: string | null }>,
  course: { id: string | number; programKey?: string | null },
) {
  return enrollments.some(
    (enrollment) =>
      ["active", "completed"].includes(enrollment.status) &&
      (relationId(enrollment.course) === String(course.id) || enrollment.programKey === course.programKey),
  );
}
