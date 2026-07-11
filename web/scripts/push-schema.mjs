/**
 * Push Payload schema to Postgres.
 * 1) npx esbuild src/payload.config.ts --bundle --platform=node --format=esm --packages=external --outfile=scripts/.payload.config.bundle.mjs
 * 2) node scripts/push-schema.mjs
 *
 * Or: npm run db:push
 */
import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });

const dbUrl = process.env.DATABASE_URL || "";
if (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://")) {
  console.error("DATABASE_URL must be a postgres connection string.");
  process.exit(1);
}
if (!process.env.PAYLOAD_SECRET) {
  console.error("PAYLOAD_SECRET is required.");
  process.exit(1);
}

// Opt-in schema push (see createDbAdapter — not enabled on normal app start)
process.env.PAYLOAD_DB_PUSH = "true";

console.log("Connecting to Postgres and pushing schema…");
console.log("Host:", (dbUrl.match(/@([^/?]+)/) || [])[1] || "(unknown)");

const bundleUrl = pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href;
const { default: config } = await import(bundleUrl);
const { getPayload } = await import("payload");

const payload = await getPayload({ config });
console.log(
  "Payload ready. Collections:",
  payload.config.collections.map((c) => c.slug).join(", "),
);
console.log("Schema push completed.");

if (typeof payload.db.destroy === "function") {
  await payload.db.destroy();
}
process.exit(0);
