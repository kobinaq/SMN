import { describe, expect, it } from "vitest";
import * as join from "@/lib/pages/join";
import { findCopyViolations } from "@/lib/pages/copy-rules";
import { site } from "@/lib/site";
import { validateSignup } from "@/lib/signup-validation";

const cohort = { name: site.cohort.name, duration: site.cohort.duration };

describe("Join TSA copy", () => {
  it("leads with Join TSA and a free account", () => {
    expect(join.signupCopy.title).toBe("Join TSA");
    expect(join.signupCopy.submitLabel).toBe("Create free account");
    expect(join.signupCopy.subtitle).toMatch(/free TSA account/);
  });

  it("keeps WhatsApp as a secondary updates link, not a group (Tab 5)", () => {
    expect(join.whatsappUpdatesLabel).toBe("Also get TSA updates on WhatsApp");
    expect(join.whatsappUpdatesLabel).not.toMatch(/group/i);
  });

  it("takes cohort facts from site data", () => {
    expect(site.cohort.duration).toBe("4 weeks");
    expect(join.cohortNote(cohort)).toContain("runs for 4 weeks");
    expect(join.firstRunCohortTitle(cohort)).toBe(`${site.cohort.name}: 4 weeks`);
    expect(join.confirmationSteps(cohort).join(" ")).toContain("4 weeks");
    expect(join.cohortNote({ name: "Test Cohort", duration: "6 weeks" })).toContain("6 weeks");
  });

  it("follows Tab 5 copy rules across static and generated copy", () => {
    expect(findCopyViolations(join)).toEqual([]);
    expect(
      findCopyViolations({
        generated: [
          join.cohortNote(cohort),
          join.confirmationSteps(cohort),
          join.confirmationSubtitle("Ama", "ama@example.com"),
          join.firstRunTitle("Ama"),
          join.firstRunCohortTitle(cohort),
          join.firstRunCohortBody(cohort),
          join.memberHomeTitle("Ama"),
        ],
      }),
    ).toEqual([]);
  });

  it("uses the Learn, Apply, Grow, Connect framework on first run", () => {
    expect(join.accountIncludes.map((item) => item.title)).toEqual(["Learn", "Apply", "Grow", "Connect"]);
    expect(join.firstRunAreas.map((item) => item.title)).toEqual(["Learn", "Apply", "Grow", "Connect"]);
    for (const area of join.firstRunAreas) expect(area.href).toMatch(/^\/app\//);
  });

  it("uses the Tab 4 dashboard welcome", () => {
    expect(join.memberHomeTitle("Ama")).toBe("Welcome, Ama.");
  });
});

describe("validateSignup", () => {
  const ok = { name: "Ama Mensah", email: "ama@example.com", password: "longenough", confirm: "longenough" };

  it("accepts valid details", () => {
    expect(validateSignup(ok)).toEqual({});
  });

  it("flags each field with its own message", () => {
    expect(validateSignup({ name: " ", email: "nope", password: "short", confirm: "" })).toEqual({
      name: join.signupCopy.errors.name,
      email: join.signupCopy.errors.email,
      password: join.signupCopy.errors.password,
      confirm: join.signupCopy.errors.confirm,
    });
  });

  it("flags mismatched passwords only on confirm", () => {
    expect(validateSignup({ ...ok, confirm: "different1" })).toEqual({ confirm: join.signupCopy.errors.confirm });
  });

  it("matches the server limits", () => {
    expect(validateSignup({ ...ok, name: "A".repeat(121) }).name).toBeDefined();
    const long = "x".repeat(201);
    expect(validateSignup({ ...ok, password: long, confirm: long }).password).toBe(
      join.signupCopy.errors.passwordTooLong,
    );
  });
});
