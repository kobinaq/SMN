import { describe, expect, it } from "vitest";
import { canStaff, staffRole } from "./staff-permissions";

describe("minimal staff permission matrix", () => {
  it("does not treat members or anonymous users as staff", () => {
    expect(staffRole(null)).toBeNull();
    expect(canStaff({ collection: "members" }, "support")).toBe(false);
  });

  it("limits domain roles and preserves super-admin oversight", () => {
    expect(canStaff({ collection: "users", role: "learning" }, "learning")).toBe(true);
    expect(canStaff({ collection: "users", role: "learning" }, "opportunity")).toBe(false);
    expect(canStaff({ collection: "users", role: "analyst" }, "learning")).toBe(false);
    expect(canStaff({ collection: "users", role: "super-admin" }, "opportunity")).toBe(true);
  });

  it("keeps pre-migration staff functional as super-admin", () => {
    expect(staffRole({ collection: "users", role: null })).toBe("super-admin");
  });
});
