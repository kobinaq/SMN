import { config as loadDotenv } from "dotenv";
import path from "node:path";

/**
 * Loads `.env` then `.env.local` so `.env.local` wins between the two files,
 * while variables already present in the real environment win over both.
 *
 * Plain `override: true` breaks that last rule: the E2E runner injects a
 * disposable SQLite DATABASE_URL, and a developer's local Postgres URL in
 * `.env.local` would silently replace it and point the run at a real database.
 */
export function loadEnv(root) {
  const injected = { ...process.env };
  loadDotenv({ path: path.join(root, ".env") });
  loadDotenv({ path: path.join(root, ".env.local"), override: true });
  Object.assign(process.env, injected);
}
