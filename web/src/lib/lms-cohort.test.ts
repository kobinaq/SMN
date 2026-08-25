import { describe, expect, it } from "vitest";
import { calculateCohortCompletion, isAttended, pickNextSession } from "@/lib/lms-cohort";

describe("calculateCohortCompletion", () => {
  it("returns zero progress when there are no sessions", () => {
    expect(calculateCohortCompletion(0, [])).toEqual({ attended: 0, percent: 0, isComplete: false });
  });

  it("computes a percentage from attended sessions", () => {
    expect(calculateCohortCompletion(4, [1, 2])).toEqual({ attended: 2, percent: 50, isComplete: false });
  });

  it("dedupes attendance and marks complete when every session is attended", () => {
    expect(calculateCohortCompletion(2, [1, 1, 2])).toEqual({ attended: 2, percent: 100, isComplete: true });
  });

  it("never exceeds 100% when attendance outnumbers sessions", () => {
    expect(calculateCohortCompletion(2, [1, 2, 3, 4])).toEqual({ attended: 2, percent: 100, isComplete: true });
  });
});

describe("isAttended", () => {
  it("counts present, late and excused as attended", () => {
    expect(isAttended("present")).toBe(true);
    expect(isAttended("late")).toBe(true);
    expect(isAttended("excused")).toBe(true);
  });
  it("does not count absent or unknown", () => {
    expect(isAttended("absent")).toBe(false);
    expect(isAttended(null)).toBe(false);
  });
});

describe("pickNextSession", () => {
  const now = new Date("2026-09-10T12:00:00Z");
  it("returns the soonest upcoming session", () => {
    const next = pickNextSession(
      [
        { id: 1, sessionAt: "2026-09-05T12:00:00Z" },
        { id: 2, sessionAt: "2026-09-15T12:00:00Z" },
        { id: 3, sessionAt: "2026-09-12T12:00:00Z" },
      ],
      now,
    );
    expect(next?.id).toBe(3);
  });
  it("returns null when all sessions are in the past", () => {
    expect(pickNextSession([{ id: 1, sessionAt: "2026-09-01T12:00:00Z" }], now)).toBeNull();
  });
});
