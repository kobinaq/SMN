import { config as loadDotenv } from "dotenv";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });

// Import map generation only needs Payload config. Avoid schema push against a
// shared/committed SQLite file (CI fails with "index already exists").
process.env.PAYLOAD_DB_PUSH = "false";
const ephemeralDb = path.join(root, `payload.importmap-${process.pid}.db`);
if (!process.env.IMPORTMAP_DATABASE_URL) {
  process.env.DATABASE_URL = `file:${ephemeralDb}`;
}

const { default: config } = await import(
  pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href
);
const { getPayload, generateImportMap } = await import("payload");
const payload = await getPayload({ config });
await generateImportMap(payload.config, { log: true, force: true });
console.log("done");
if (payload.db.destroy) await payload.db.destroy();

if (!process.env.IMPORTMAP_DATABASE_URL) {
  for (const suffix of ["", "-shm", "-wal"]) {
    rmSync(`${ephemeralDb}${suffix}`, { force: true });
  }
}

process.exit(0);
