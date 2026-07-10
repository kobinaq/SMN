import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Whether to hit Payload for public pages.
 * On Vercel, SQLite is not durable (serverless /tmp). Use seed content unless a
 * remote DB URL is configured (Postgres, Turso/libsql, etc.).
 */
export function shouldUseCms(): boolean {
  if (process.env.USE_SEED_CONTENT === "true") return false;

  const db = process.env.DATABASE_URL || "";
  const remoteDb =
    db.startsWith("postgres") ||
    db.startsWith("postgresql") ||
    db.includes("libsql") ||
    db.includes("turso") ||
    db.startsWith("mysql");

  if (process.env.VERCEL && !remoteDb) return false;

  return true;
}

export async function getPayloadClient() {
  return getPayload({ config });
}

/** Fetch CMS data with graceful fallback when DB isn't ready. */
export async function safePayloadQuery<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!shouldUseCms()) {
    return fallback;
  }

  try {
    return await query();
  } catch (error) {
    console.warn("[payload] query failed, using fallback content", error);
    return fallback;
  }
}
