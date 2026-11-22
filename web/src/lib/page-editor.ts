import type { Access, PayloadRequest } from "payload";
import { canStaff } from "@/lib/staff-permissions";

/**
 * The one switch for the page editor. It is off only on the production
 * deployment (VERCEL_ENV === "production"). Env is read at call time so the
 * answer is never frozen into a build.
 */
export function isPageEditorEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.VERCEL_ENV !== "production";
}

type EditorUser = { collection?: string; role?: string | null } | null | undefined;

/** Content staff (super-admin included) while the editor is enabled. Never anyone else. */
export function canUsePageEditor(user: unknown, env: Record<string, string | undefined> = process.env): boolean {
  if (!isPageEditorEnabled(env)) return false;
  const staff = user as EditorUser;
  if (staff?.collection !== "users") return false;
  return canStaff(staff as Parameters<typeof canStaff>[0], "content");
}

const editorAccess = ({ req }: { req: Pick<PayloadRequest, "user"> }): boolean => canUsePageEditor(req.user);

/** Payload access functions. Every operation is closed in production, REST and GraphQL included. */
export const pageEditorAccess = {
  admin: editorAccess,
  read: editorAccess,
  create: editorAccess,
  update: editorAccess,
  delete: editorAccess,
  readVersions: editorAccess,
} satisfies Record<string, Access>;

/**
 * Admin routes that may render Payload's UI when the editor is enabled:
 * /admin/collections/pages/** and /admin/globals/(header|footer)/**.
 */
export function isPageEditorAdminPath(segments: string[]): boolean {
  const [area, slug] = segments;
  if (area === "collections") return slug === "pages";
  if (area === "globals") return slug === "header" || slug === "footer";
  return false;
}
