import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Ensures a disposable SQLite file has a Payload schema.
 * Used by CI before `next build` when DATABASE_URL is a file: SQLite URL.
 * Postgres environments no-op.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });

const databaseUrl = process.env.DATABASE_URL || "";
if (/^postgres(ql)?:\/\//.test(databaseUrl)) {
  console.log("ensure-sqlite-schema: Postgres DATABASE_URL detected — nothing to do.");
  process.exit(0);
}

process.env.PAYLOAD_DB_PUSH = "true";
if (!databaseUrl) {
  process.env.DATABASE_URL = `file:${path.join(root, "payload.db")}`;
}

const { default: config } = await import(
  pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href
);
const { getPayload } = await import("payload");
const payload = await getPayload({ config });
console.log("ensure-sqlite-schema: SQLite schema ready at", process.env.DATABASE_URL);
if (typeof payload.db.destroy === "function") await payload.db.destroy();
process.exit(0);
