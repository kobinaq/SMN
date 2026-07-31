import { readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(root);

// Sweep throwaway databases stranded by earlier runs whose handle was still held.
for (const entry of readdirSync(root)) {
  if (!entry.startsWith("payload.importmap-")) continue;
  try {
    rmSync(path.join(root, entry), { force: true });
  } catch {}
}

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

// The import map is already written at this point, so removing the throwaway
// database is housekeeping only. Windows keeps the SQLite file handle open past
// db.destroy(), and rmSync's `force` suppresses ENOENT but not EPERM, so a
// failure here must never fail the build.
if (!process.env.IMPORTMAP_DATABASE_URL) {
  for (const suffix of ["", "-shm", "-wal"]) {
    try {
      rmSync(`${ephemeralDb}${suffix}`, { force: true });
    } catch {}
  }
}

process.exit(0);
