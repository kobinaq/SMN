import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });

process.env.NODE_ENV = "development";

console.log(
  "DB kind:",
  (process.env.DATABASE_URL || "").startsWith("postgres") ? "postgres" : "other",
);

const outfile = path.join(root, "scripts", ".payload.config.bundle.mjs");
await build({
  entryPoints: [path.join(root, "src", "payload.config.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile,
});

const { default: config } = await import(pathToFileURL(outfile).href);
const { getPayload } = await import("payload");

try {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "users",
    limit: 1,
    overrideAccess: true,
  });
  console.log("find users OK, totalDocs:", result.totalDocs);
  if (typeof payload.db.destroy === "function") await payload.db.destroy();
  process.exit(0);
} catch (e) {
  console.error("FAIL:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
  if (e.data) console.error("DATA:", JSON.stringify(e.data, null, 2).slice(0, 2000));
  console.error(e.stack?.split("\n").slice(0, 25).join("\n"));
  process.exit(1);
}
