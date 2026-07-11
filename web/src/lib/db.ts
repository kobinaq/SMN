import path from "path";
import { fileURLToPath } from "url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export function isPostgresUrl(url: string) {
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

/**
 * Postgres when DATABASE_URL is a postgres connection string.
 * Otherwise SQLite (local file, or /tmp on Vercel without remote DB).
 */
export function createDbAdapter() {
  const databaseUrl = process.env.DATABASE_URL || "";

  if (isPostgresUrl(databaseUrl)) {
    return postgresAdapter({
      pool: {
        connectionString: databaseUrl,
      },
      push: process.env.NODE_ENV !== "production",
    });
  }

  const sqliteUrl =
    databaseUrl.startsWith("file:")
      ? databaseUrl
      : process.env.VERCEL
        ? "file:/tmp/payload.db"
        : `file:${path.resolve(dirname, "../../payload.db")}`;

  return sqliteAdapter({
    client: {
      url: sqliteUrl,
    },
    push: process.env.NODE_ENV !== "production",
  });
}
