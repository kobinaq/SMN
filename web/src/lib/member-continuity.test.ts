import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/payload", () => ({
  getPayloadClient: vi.fn(async () => ({
    find: vi.fn(async () => {
      throw new Error("simulated query failure");
    }),
  })),
}));

vi.mock("@/lib/lms", () => ({
  getLmsCourses: vi.fn(async () => {
    throw new Error("lms failed");
  }),
}));

vi.mock("@/lib/opportunities", () => ({
  getMemberOpportunityActivity: vi.fn(async () => {
    throw new Error("opportunities failed");
  }),
}));

vi.mock("@/lib/certificates", () => ({
  getMemberCertificates: vi.fn(async () => {
    throw new Error("certificates failed");
  }),
}));

vi.mock("@/lib/portfolios", () => ({
  getMemberPortfolios: vi.fn(async () => {
    throw new Error("portfolios failed");
  }),
}));

vi.mock("@/lib/mentors", () => ({
  getMentorApplicationStatus: vi.fn(async () => {
    throw new Error("mentors failed");
  }),
}));

import { getMemberContinuity } from "@/lib/member-continuity";

describe("getMemberContinuity resilience", () => {
  it("returns a usable home payload when downstream queries fail", async () => {
    const result = await getMemberContinuity({
      id: 1,
      email: "member@example.com",
      name: "Ama",
      collection: "members",
      visibility: "private",
    });

    expect(result.courses).toEqual([]);
    expect(result.primary?.href).toBe("/app/profile");
    expect(result.profile.percent).toBeGreaterThanOrEqual(0);
    expect(result.opportunityActivityCount).toBe(0);
  });
});
