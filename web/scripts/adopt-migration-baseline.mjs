import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(root);
if (process.env.ALLOW_MIGRATION_BASELINE !== "true") throw new Error("Refusing to adopt a baseline without ALLOW_MIGRATION_BASELINE=true.");
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL || "")) throw new Error("DATABASE_URL must point to the existing PostgreSQL database.");

process.env.PAYLOAD_DB_PUSH = "false";

/**
 * Marks the current migration files as already applied, without running any
 * of them, for a database whose schema was created by `db:push` (dev mode)
 * rather than by migrations. This is the safe reconciliation path for that
 * state — see `db:migrate`'s own refusal message, which points here.
 *
 * Every file in src/migrations is adopted in one batch: this is a one-time
 * "the schema already matches" declaration, not a partial replay, so there is
 * no meaningful batch-by-batch distinction to preserve. It was originally
 * written for a single baseline file and never updated as more migrations
 * were added — fixed here to adopt however many files actually exist today,
 * so it still works as the project's migration history grows.
 */
const migrationFiles = readdirSync(path.join(root, "src", "migrations"))
  .filter((file) => /^\d.*\.ts$/.test(file))
  .sort();
if (!migrationFiles.length) throw new Error("No migration files found in src/migrations.");
const names = migrationFiles.map((file) => file.replace(/\.ts$/, ""));

const { default: config } = await import(pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href);
const { getPayload } = await import("payload");
const payload = await getPayload({ config });

// Full reads deliberately prove that the existing schema already contains
// tables and columns spanning the full migration history — core, LMS,
// certificates, mentorship and AI — before any row is written.
for (const collection of ["members", "users", "lms-courses", "lms-sessions", "certificates", "member-notes", "mentorship-relationships", "ai-usage-records", "ai-feedback", "ai-knowledge-sources", "ai-drafts", "ai-career-states"]) {
  await payload.find({ collection, depth: 0, limit: 1, overrideAccess: true });
}

const already = await payload.find({
  collection: "payload-migrations",
  depth: 0,
  limit: 0,
  overrideAccess: true,
  where: { name: { in: names } },
});
const adoptedNames = new Set(already.docs.map((doc) => doc.name));
const pending = names.filter((name) => !adoptedNames.has(name));

if (!pending.length) {
  console.log(`Migration baseline already adopted: all ${names.length} migration(s).`);
} else {
  const latest = await payload.find({ collection: "payload-migrations", depth: 0, limit: 1, sort: "-batch", overrideAccess: true });
  const batch = Math.max(1, Number(latest.docs[0]?.batch || 0));
  for (const name of pending) {
    await payload.create({ collection: "payload-migrations", data: { name, batch }, overrideAccess: true });
  }
  console.log(`Adopted ${pending.length} migration(s) into batch ${batch}: ${pending.join(", ")}`);
}

/**
 * Clear the dev-mode marker(s) now that a human has explicitly run this
 * gated tool. Payload's own migrate() never deletes this row even when a
 * human answers "yes" to its confirm — it only filters it out of that one
 * in-memory run — so left in place it would ask the same question again on
 * every future `db:migrate`, forever. This is the one deliberate, reviewed
 * moment to retire it for good.
 */
const devMarkers = await payload.find({
  collection: "payload-migrations",
  depth: 0,
  limit: 0,
  overrideAccess: true,
  where: { batch: { equals: -1 } },
});
for (const doc of devMarkers.docs) {
  await payload.delete({ collection: "payload-migrations", id: doc.id, overrideAccess: true });
}
if (devMarkers.docs.length) {
  console.log(`Cleared ${devMarkers.docs.length} dev-mode marker(s). Future db:migrate runs will not ask again.`);
}

if (typeof payload.db.destroy === "function") await payload.db.destroy();
process.exit(0);
