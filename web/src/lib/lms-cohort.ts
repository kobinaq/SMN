import type { Payload, PayloadRequest } from "payload";

/** Attendance marks that count as "attended" for completion. */
export const ATTENDED_STATUSES = ["present", "late", "excused"] as const;
export type AttendanceStatus = "present" | "late" | "excused" | "absent";

export function isAttended(status: unknown): boolean {
  return typeof status === "string" && (ATTENDED_STATUSES as readonly string[]).includes(status);
}

/** Cohort progress is driven by live-session attendance, not self-marked lessons. */
export function calculateCohortCompletion(
  totalSessions: number,
  attendedSessionIDs: Array<string | number>,
) {
  const attended = new Set(attendedSessionIDs.map(String)).size;
  const boundedAttended = Math.min(attended, Math.max(totalSessions, 0));
  const percent = totalSessions > 0 ? Math.round((boundedAttended / totalSessions) * 100) : 0;
  return { attended: boundedAttended, percent, isComplete: totalSessions > 0 && boundedAttended === totalSessions };
}

type SessionLike = { id: string | number; sessionAt?: string | null; status?: string | null };

/** The next upcoming published session relative to `now`, else null. */
export function pickNextSession<T extends SessionLike>(sessions: T[], now: Date = new Date()): T | null {
  const upcoming = sessions
    .filter((session) => session.sessionAt && new Date(session.sessionAt).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.sessionAt as string).getTime() - new Date(b.sessionAt as string).getTime());
  return upcoming[0] ?? null;
}

function relationID(value: unknown): string {
  if (value && typeof value === "object" && "id" in value) return String((value as { id: unknown }).id);
  return value == null ? "" : String(value);
}

/**
 * Recompute enrollment completion for a cohort member from session attendance.
 * Mirrors the self-paced lesson-progress sync, but keyed on attendance so a
 * cohort learner's progress reflects the live sessions they actually attended.
 */
export async function syncCohortCompletion(
  payload: Payload,
  args: { courseID: string | number; memberID: string | number; req?: PayloadRequest },
) {
  const { req } = args;
  const courseID = Number(args.courseID);
  const memberID = Number(args.memberID);
  if (!Number.isFinite(courseID) || !Number.isFinite(memberID)) return;
  const course = await payload.findByID({ collection: "lms-courses", id: courseID, depth: 0, overrideAccess: true, req });
  if (!course || (course as { delivery?: string }).delivery !== "cohort") return;

  const [sessions, attendance, enrollments] = await Promise.all([
    payload.find({
      collection: "lms-sessions",
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      req,
      where: { and: [{ course: { equals: courseID } }, { status: { equals: "published" } }] },
    }),
    payload.find({
      collection: "lms-attendance",
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      req,
      where: {
        and: [
          { course: { equals: courseID } },
          { member: { equals: memberID } },
          { status: { in: [...ATTENDED_STATUSES] } },
        ],
      },
    }),
    payload.find({
      collection: "enrollments",
      depth: 0,
      limit: 100,
      overrideAccess: true,
      req,
      where: { and: [{ member: { equals: memberID } }, { programKey: { equals: course.programKey } }] },
    }),
  ]);

  const completion = calculateCohortCompletion(
    sessions.totalDocs,
    attendance.docs.map((row) => relationID((row as { session?: unknown }).session)),
  );
  const now = new Date().toISOString();
  await Promise.all(
    enrollments.docs.map((enrollment) =>
      payload.update({
        collection: "enrollments",
        id: enrollment.id,
        overrideAccess: true,
        req,
        data: {
          course: courseID,
          startedAt: enrollment.startedAt || now,
          lastActivityAt: now,
          completedAt: completion.isComplete ? enrollment.completedAt || now : null,
          completionPercent: completion.percent,
          certificateEligible: Boolean(completion.isComplete && course.certificateEnabled),
          status: completion.isComplete ? "completed" : enrollment.status === "completed" ? "active" : enrollment.status,
        },
      }),
    ),
  );
}
