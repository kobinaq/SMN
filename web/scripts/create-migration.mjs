import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL || "")) throw new Error("Migration snapshots must be generated with a PostgreSQL DATABASE_URL.");

const migrationName = process.argv[2];
if (!migrationName) throw new Error("Usage: npm run db:migrate:create -- <migration-name>");
process.env.PAYLOAD_MIGRATING = "true";
const { default: config } = await import(pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href);
const { default: payload } = await import("payload");
await payload.init({ config, disableDBConnect: true, disableOnInit: true });
await payload.db.createMigration({ migrationName, payload, forceAcceptWarning: true });
console.log(`Migration snapshot created: ${migrationName}`);
process.exit(0);
