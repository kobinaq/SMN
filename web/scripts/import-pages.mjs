/**
 * Imports the code pages (home, about) and the Header/Footer globals into the CMS.
 * Dev and local databases only. Repeatable: a second identical run changes nothing.
 *
 *   ALLOW_DEMO_SEED=1 DATABASE_URL=<dev database url> npm run import:pages -- --publish
 *
 * Flags: --dry-run (plan only), --publish (publish instead of saving drafts),
 * --overwrite (replace CMS content that differs from the import).
 * Never logs the connection string.
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";
import { assertNonProdOrExit } from "./lib/assert-non-prod.mjs";
import { decideImportTarget, parseImportArgs } from "./import-pages-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(root);

// Guards run before anything connects to a database.
assertNonProdOrExit("import-pages");

const target = decideImportTarget(process.env);
if (!target.ok) {
  console.error(`[import-pages] Refused. ${target.reason}`);
  process.exit(1);
}

const args = parseImportArgs(process.argv.slice(2));
if (!args.ok) {
  console.error(`[import-pages] ${args.reason}`);
  process.exit(1);
}

// Never push schema from the import. Migrations own the schema.
process.env.PAYLOAD_DB_PUSH = "false";

const { default: config } = await import(pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href);
const { runImport } = await import(pathToFileURL(path.join(root, "scripts", ".import-pages.bundle.mjs")).href);
const { getPayload } = await import("payload");

console.log(`[import-pages] Target: ${target.target} database.${args.flags.dryRun ? " Dry run, nothing will be written." : ""}`);
const payload = await getPayload({ config });
try {
  await runImport(payload, { flags: args.flags, log: (line) => console.log(`[import-pages] ${line}`) });
} catch (error) {
  console.error(`[import-pages] Failed: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exitCode = 1;
}
process.exit(process.exitCode ?? 0);
