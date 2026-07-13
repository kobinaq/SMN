import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL || "")) throw new Error("DATABASE_URL must point to PostgreSQL.");
process.env.PAYLOAD_MIGRATING = "true";
process.env.PAYLOAD_DB_PUSH = "false";
const { default: config } = await import(pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href);
const { default: payload } = await import("payload");
await payload.init({ config, disableOnInit: true });
await payload.db.migrate();
if (typeof payload.db.destroy === "function") await payload.db.destroy();
console.log("Payload migrations completed.");
process.exit(0);
