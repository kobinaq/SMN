/**
 * Run pending Payload migrations, but only on a production deploy.
 *
 * Vercel runs `vercel-build` in place of `build` when it exists, which is the
 * hook we use to keep the deployed schema in step with the deployed code.
 * Preview deployments deliberately skip it: previews may point at the same
 * database as production, and a preview build must never migrate it.
 *
 * `db:migrate` refuses anything that is not PostgreSQL and is non-interactive,
 * so this stays a no-op locally and in CI.
 */
import { spawn } from "node:child_process";

const env = process.env.VERCEL_ENV;

if (env !== "production") {
  console.log(
    `[deploy] VERCEL_ENV=${env ?? "unset"} — skipping migrations. ` +
      "Only production deploys migrate; run `npm run db:migrate` by hand for other environments.",
  );
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.error("[deploy] Production build has no DATABASE_URL; refusing to continue.");
  process.exit(1);
}

console.log("[deploy] Production deploy — running Payload migrations before the build.");

const child = spawn("npm", ["run", "db:migrate"], { stdio: "inherit" });
child.on("exit", (code) => {
  if (code !== 0) {
    console.error(
      "[deploy] Migrations failed. Stopping the build rather than shipping code the database cannot serve.",
    );
  }
  process.exit(code ?? 1);
});
