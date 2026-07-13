import type { Payload, TypedUser } from "payload";
import { canStaff, type StaffRole } from "@/lib/staff-permissions";
import type { StaffUser } from "@/lib/auth/staff";

export type StaffAccess = { overrideAccess: false; user: TypedUser };

export function staffAccess(user: StaffUser): StaffAccess {
  return { overrideAccess: false, user: user as unknown as TypedUser };
}

export function assertStaffCan(user: StaffUser, ...roles: StaffRole[]) {
  if (!canStaff(user, ...roles)) {
    throw new Error("You do not have permission for this action.");
  }
}

export async function listCollection(
  payload: Payload,
  user: StaffUser,
  collection: string,
  options: { limit?: number; page?: number; sort?: string; where?: Record<string, unknown>; depth?: number } = {},
) {
  return payload.find({
    collection: collection as never,
    depth: options.depth ?? 0,
    limit: options.limit ?? 50,
    page: options.page ?? 1,
    sort: options.sort ?? "-updatedAt",
    where: options.where as never,
    ...staffAccess(user),
  });
}

export async function getCollectionDoc(
  payload: Payload,
  user: StaffUser,
  collection: string,
  id: string | number,
  depth = 1,
) {
  return payload.findByID({
    collection: collection as never,
    id,
    depth,
    ...staffAccess(user),
  });
}

export async function createCollectionDoc(
  payload: Payload,
  user: StaffUser,
  collection: string,
  data: Record<string, unknown>,
) {
  return payload.create({
    collection: collection as never,
    data: data as never,
    ...staffAccess(user),
  });
}

export async function updateCollectionDoc(
  payload: Payload,
  user: StaffUser,
  collection: string,
  id: string | number,
  data: Record<string, unknown>,
) {
  return payload.update({
    collection: collection as never,
    id,
    data: data as never,
    ...staffAccess(user),
  });
}

export async function deleteCollectionDoc(
  payload: Payload,
  user: StaffUser,
  collection: string,
  id: string | number,
) {
  return payload.delete({
    collection: collection as never,
    id,
    ...staffAccess(user),
  });
}

/** Convert plain text into a minimal Lexical document for richText fields. */
export function plainTextToLexical(text: string) {
  const paragraphs = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: (paragraphs.length ? paragraphs : [""]).map((line) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        children: line
          ? [{ type: "text", text: line, detail: 0, format: 0, mode: "normal", style: "", version: 1 }]
          : [],
      })),
    },
  };
}

export function lexicalToPlainText(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const root = (value as { root?: { children?: Array<{ children?: Array<{ text?: string }> }> } }).root;
  if (!root?.children) return "";
  return root.children
    .map((node) => (node.children || []).map((child) => child.text || "").join(""))
    .filter(Boolean)
    .join("\n\n");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function relationId(value: unknown) {
  if (value == null) return "";
  if (typeof value === "object" && "id" in value) return String((value as { id: string | number }).id);
  return String(value);
}

export function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toDateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
