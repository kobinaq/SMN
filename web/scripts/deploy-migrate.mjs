/**
 * Run pending Payload migrations on Vercel production, and on preview when
 * DATABASE_URL points at the Neon dev endpoint.
 *
 * Vercel runs `vercel-build` in place of `build`. Local and CI builds call
 * `next build` directly, so they never reach this script. Any other
 * VERCEL_ENV still skips migrations.
 *
 * `db:migrate` refuses anything that is not PostgreSQL and is non-interactive.
 */
import { spawn } from "node:child_process";
import { decideDeployMigration } from "./deploy-migrate-guard.mjs";

const decision = decideDeployMigration(process.env);

if (decision.action === "skip") {
  console.log(decision.message);
  process.exit(0);
}

if (decision.action === "fail") {
  console.error(decision.message);
  process.exit(1);
}

console.log(decision.message);

const child = spawn("npm", ["run", "db:migrate"], { stdio: "inherit" });
child.on("exit", (code) => {
  if (code !== 0) {
    console.error(
      "[deploy] Migrations failed. Stopping the build rather than shipping code the database cannot serve.",
    );
  }
  process.exit(code ?? 1);
});
