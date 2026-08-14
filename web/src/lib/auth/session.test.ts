import { describe, expect, it } from "vitest";
import {
  ADMIN_TOKEN_COOKIE,
  MEMBER_TOKEN_COOKIE,
  memberSessionHeaders,
  staffSessionHeaders,
} from "@/lib/auth/session";

describe("memberSessionHeaders", () => {
  it("promotes the member cookie onto the admin cookie name", () => {
    const headers = memberSessionHeaders(
      new Headers({ cookie: `${MEMBER_TOKEN_COOKIE}=member.jwt; theme=dark` }),
    );
    const cookie = headers.get("cookie") || "";
    expect(cookie).toContain(`${ADMIN_TOKEN_COOKIE}=member.jwt`);
    expect(cookie).not.toContain(`${MEMBER_TOKEN_COOKIE}=`);
    expect(cookie).toContain("theme=dark");
  });
});

describe("staffSessionHeaders", () => {
  it("drops the member cookie and sets a JWT authorization header", () => {
    const headers = staffSessionHeaders(
      new Headers({
        cookie: `${ADMIN_TOKEN_COOKIE}=staff.jwt; ${MEMBER_TOKEN_COOKIE}=member.jwt`,
        origin: "https://preview.example",
      }),
    );
    expect(headers.get("cookie")).toBe(`${ADMIN_TOKEN_COOKIE}=staff.jwt`);
    expect(headers.get("Authorization")).toBe("JWT staff.jwt");
    expect(headers.get("origin")).toBeNull();
  });
});
