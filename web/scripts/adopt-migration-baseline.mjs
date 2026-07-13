import { config as loadDotenv } from "dotenv";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });
if (process.env.ALLOW_MIGRATION_BASELINE !== "true") throw new Error("Refusing to adopt a baseline without ALLOW_MIGRATION_BASELINE=true.");
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL || "")) throw new Error("DATABASE_URL must point to the existing PostgreSQL database.");

process.env.PAYLOAD_DB_PUSH = "false";
const migrationFiles = readdirSync(path.join(root, "src", "migrations")).filter((file) => /^\d.*\.ts$/.test(file)).sort();
if (migrationFiles.length !== 1) throw new Error(`Expected exactly one baseline migration, found ${migrationFiles.length}.`);
const name = migrationFiles[0].replace(/\.ts$/, "");
const { default: config } = await import(pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href);
const { getPayload } = await import("payload");
const payload = await getPayload({ config });

// Full reads deliberately prove that the existing schema already contains the baseline tables and columns.
for (const collection of ["members", "users", "lms-courses", "certificates", "member-notes", "mentorship-relationships", "ai-usage-records", "ai-feedback", "ai-knowledge-sources", "ai-drafts", "ai-career-states"]) {
  await payload.find({ collection, depth: 0, limit: 1, overrideAccess: true });
}
const existing = await payload.find({ collection: "payload-migrations", depth: 0, limit: 1, overrideAccess: true, where: { name: { equals: name } } });
if (!existing.totalDocs) {
  const latest = await payload.find({ collection: "payload-migrations", depth: 0, limit: 1, sort: "-batch", overrideAccess: true });
  const batch = Math.max(1, Number(latest.docs[0]?.batch || 0));
  await payload.create({ collection: "payload-migrations", data: { name, batch }, overrideAccess: true });
  console.log(`Adopted migration baseline: ${name}`);
} else console.log(`Migration baseline already adopted: ${name}`);
if (typeof payload.db.destroy === "function") await payload.db.destroy();
process.exit(0);
