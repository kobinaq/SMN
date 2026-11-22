/**
 * Pure decisions for scripts/import-pages.mjs. No I/O, never prints the
 * connection string.
 */
import {
  PREVIEW_DB_ENDPOINT_ID,
  PRODUCTION_DB_ENDPOINT_ID,
  databaseEndpointId,
  migrationDatabaseUrl,
} from "./deploy-migrate-guard.mjs";

/** Neon dev endpoint, the only remote database the import may touch. */
export const IMPORT_DEV_ENDPOINT_ID = PREVIEW_DB_ENDPOINT_ID;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ ok: true, target: string } | { ok: false, reason: string }}
 */
export function decideImportTarget(env) {
  const url = migrationDatabaseUrl(env);
  if (!url) return { ok: false, reason: "DATABASE_URL is missing." };
  if (!/^postgres(ql)?:\/\//i.test(url)) {
    return { ok: false, reason: "DATABASE_URL must be a Postgres connection string." };
  }
  const parsed = databaseEndpointId(url);
  if (!parsed.parsed || !parsed.endpointId || !parsed.hostname) {
    return { ok: false, reason: "DATABASE_URL could not be parsed." };
  }
  const host = parsed.hostname.toLowerCase();
  if (parsed.endpointId === PRODUCTION_DB_ENDPOINT_ID) {
    return { ok: false, reason: "Refusing to import: DATABASE_URL points at the production database." };
  }
  if (LOCAL_HOSTS.has(host)) return { ok: true, target: "local" };
  if (parsed.endpointId === IMPORT_DEV_ENDPOINT_ID) return { ok: true, target: "dev" };
  const shown = parsed.endpointId.startsWith("ep-") ? parsed.endpointId : "unrecognized";
  return {
    ok: false,
    reason: `Host ${shown} is not allowed. The import runs only against localhost, 127.0.0.1 or endpoint ${IMPORT_DEV_ENDPOINT_ID}.`,
  };
}

const FLAGS = { "--dry-run": "dryRun", "--publish": "publish", "--overwrite": "overwrite" };

/**
 * @param {string[]} argv
 * @returns {{ ok: true, flags: { dryRun: boolean, publish: boolean, overwrite: boolean } } | { ok: false, reason: string }}
 */
export function parseImportArgs(argv) {
  const flags = { dryRun: false, publish: false, overwrite: false };
  for (const arg of argv) {
    const key = FLAGS[arg];
    if (!key) return { ok: false, reason: `Unknown option ${arg}. Use --dry-run, --publish, --overwrite.` };
    flags[key] = true;
  }
  return { ok: true, flags };
}
