import path from "path";
import { fileURLToPath } from "url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export function isPostgresUrl(url: string) {
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

function isNeonUrl(url: string) {
  return url.includes("neon.tech") || url.includes("neon.database");
}

/**
 * Schema push is opt-in only (`PAYLOAD_DB_PUSH=true`).
 * Auto-push on every connect is slow and can fail admin requests
 * (Drizzle "Pulling schema..." for 20–30s). Use `npm run db:push` instead.
 */
function shouldPushSchema() {
  return process.env.PAYLOAD_DB_PUSH === "true";
}

/**
 * Postgres when DATABASE_URL is a postgres connection string.
 * Otherwise SQLite (local file, or /tmp on Vercel without remote DB).
 */
export function createDbAdapter() {
  const databaseUrl = process.env.DATABASE_URL || "";

  if (isPostgresUrl(databaseUrl)) {
    const neon = isNeonUrl(databaseUrl);
    return postgresAdapter({
      pool: {
        connectionString: databaseUrl,
        // Neon + Node often need relaxed TLS; also avoids intermittent SSL failures
        ...(neon || databaseUrl.includes("sslmode=require")
          ? { ssl: { rejectUnauthorized: false } }
          : {}),
        max: neon ? 5 : 10,
        connectionTimeoutMillis: 15_000,
      },
      push: shouldPushSchema(),
    });
  }

  const sqliteUrl = databaseUrl.startsWith("file:")
    ? databaseUrl
    : process.env.VERCEL
      ? "file:/tmp/payload.db"
      : `file:${path.resolve(dirname, "../../payload.db")}`;

  return sqliteAdapter({
    client: {
      url: sqliteUrl,
    },
    // Same gate as Postgres: never auto-push on connect. CI/build/importmap must not
    // mutate a shared SQLite file (Drizzle can fail with "index already exists").
    push: shouldPushSchema(),
  });
}
