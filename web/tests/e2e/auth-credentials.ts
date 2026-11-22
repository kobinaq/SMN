import { test } from "@playwright/test";

/** Login credentials for e2e specs come from env only; nothing is committed. */
export type Credentials = { email: string; password: string };

function read(emailKey: string, passwordKey: string): Credentials | null {
  const email = process.env[emailKey]?.trim();
  const password = process.env[passwordKey];
  return email && password ? { email, password } : null;
}

export const staffCredentials = () => read("E2E_STAFF_EMAIL", "E2E_STAFF_PASSWORD");
export const memberCredentials = () => read("E2E_MEMBER_EMAIL", "E2E_MEMBER_PASSWORD");

export const STAFF_SKIP_MESSAGE = "Set E2E_STAFF_EMAIL and E2E_STAFF_PASSWORD to run staff login tests.";
export const MEMBER_SKIP_MESSAGE = "Set E2E_MEMBER_EMAIL and E2E_MEMBER_PASSWORD to run member login tests.";

/** Call inside a test/hook: skips the test when credentials are absent. */
export function requireStaff(): Credentials {
  const creds = staffCredentials();
  test.skip(!creds, STAFF_SKIP_MESSAGE);
  return creds as Credentials;
}

export function requireMember(): Credentials {
  const creds = memberCredentials();
  test.skip(!creds, MEMBER_SKIP_MESSAGE);
  return creds as Credentials;
}
