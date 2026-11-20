/**
 * Seeds the Social Media Marketing course on the DEV database only.
 *
 *   npm run seed:courses            run against DATABASE_URL (dev endpoint only)
 *   node scripts/seed-courses.mjs --print-sql   print the SQL, no connection
 *
 * Never logs the connection string.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadEnv } from "./load-env.mjs";
import { decideSeedTarget, smmCourse, smmSeedSql } from "./seed-courses-lib.mjs";

if (process.argv.includes("--print-sql")) {
  console.log(smmSeedSql());
  process.exit(0);
}

loadEnv(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."));

const target = decideSeedTarget(process.env);
if (!target.ok) {
  console.error(`[seed-courses] Refused. ${target.reason}`);
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL?.trim() });
try {
  await client.connect();
  await client.query(smmSeedSql());
  const { rows } = await client.query('SELECT "id" FROM "courses" WHERE "slug" = $1', [smmCourse.slug]);
  console.log(`[seed-courses] endpoint ${target.endpointId}, course id ${rows[0]?.id ?? "unknown"}`);
} catch (error) {
  console.error(`[seed-courses] Failed: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
