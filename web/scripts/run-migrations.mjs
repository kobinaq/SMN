import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(root);
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL || "")) throw new Error("DATABASE_URL must point to PostgreSQL.");
process.env.PAYLOAD_MIGRATING = "true";
process.env.PAYLOAD_DB_PUSH = "false";
const { default: config } = await import(pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href);
// `payload.db.migrate()` defaults to reading the migrations directory itself
// and sorting filenames alphabetically — which silently ignores the
// hand-ordered list in src/migrations/index.ts. That reordering is real: on
// a genuinely empty database, "20260814_course_domain_rebuild" alphabetizes
// before "20260814_wave3_cohort_applications" even though it references a
// table the wave3 migration creates, and the alphabetical run fails outright.
// Passing the index's own ordered array sidesteps the directory scan entirely.
const { migrations } = await import(pathToFileURL(path.join(root, "scripts", ".migrations.bundle.mjs")).href);
const { default: payload } = await import("payload");
await payload.init({ config, disableOnInit: true });

/**
 * Payload's own migrate() refuses to run against a database that was set up
 * via `db:push` (dev mode) without a human confirming the data loss that can
 * follow — it marks that state with a `batch: -1` row in payload-migrations
 * and asks an interactive yes/no question before proceeding.
 *
 * In an unattended pipeline (this script also runs from `vercel-build` on
 * every production deploy) that question has no good automatic answer:
 * auto-accepting "yes, data loss is fine" is exactly the kind of destructive
 * call a script must never make unattended, and letting the prompt run
 * un-answered just hangs the deploy on stdin until Vercel kills the build —
 * which was observed in production. So this checks for that marker itself,
 * first, and fails fast with the real remedy instead of ever reaching
 * Payload's interactive prompt.
 */
async function wasDevModePushed() {
  try {
    const { docs } = await payload.find({
      collection: "payload-migrations",
      where: { batch: { equals: -1 } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return docs.length > 0;
  } catch {
    // No payload-migrations table yet — a fresh database, not a pushed one.
    return false;
  }
}

if (await wasDevModePushed()) {
  console.error(
    "\n[db:migrate] This database was set up with `db:push` (dev mode), not migrations.\n" +
      "Running migrate() here would ask to accept data loss — refusing to do that unattended.\n\n" +
      "If the current schema already matches the baseline migration and no data loss is\n" +
      "intended, reconcile the tracking table without touching data or schema:\n\n" +
      "  ALLOW_MIGRATION_BASELINE=true npm run db:migrate:adopt\n\n" +
      "Then re-run `npm run db:migrate`. If that is not what you intended, stop and\n" +
      "investigate why this database has a dev-mode marker before proceeding.\n",
  );
  process.exitCode = 1;
} else {
  await payload.db.migrate({ migrations });
  console.log("Payload migrations completed.");
}
if (typeof payload.db.destroy === "function") await payload.db.destroy();
process.exit(process.exitCode ?? 0);
