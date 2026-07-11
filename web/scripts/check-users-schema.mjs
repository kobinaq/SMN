import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env") });
loadDotenv({ path: path.join(root, ".env.local"), override: true });

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

async function cols(table) {
  const res = await client.query(
    `SELECT column_name, data_type
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    [table],
  );
  return res.rows;
}

for (const t of ["users", "users_sessions", "members", "members_sessions"]) {
  const exists = await client.query(
    `SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1`,
    [t],
  );
  if (!exists.rowCount) {
    console.log(`\nMISSING TABLE: ${t}`);
    continue;
  }
  console.log(`\n${t}:`);
  for (const c of await cols(t)) {
    console.log(`  - ${c.column_name} (${c.data_type})`);
  }
}

// Reproduce the failing query to see the real Postgres error
try {
  await client.query(`
    select "users"."id", "users"."name", "users"."updated_at", "users"."created_at",
      "users"."email", "users"."reset_password_token", "users"."reset_password_expiration",
      "users"."salt", "users"."hash", "users"."login_attempts", "users"."lock_until",
      "users_sessions"."data" as "sessions"
    from "users" "users"
    left join lateral (
      select coalesce(json_agg(json_build_array(
        "users_sessions"."_order", "users_sessions"."id",
        "users_sessions"."created_at", "users_sessions"."expires_at"
      ) order by "users_sessions"."_order" asc), '[]'::json) as "data"
      from (
        select * from "users_sessions" "users_sessions"
        where "users_sessions"."_parent_id" = "users"."id"
        order by "users_sessions"."_order" asc
      ) "users_sessions"
    ) "users_sessions" on true
    order by "users"."created_at" desc
    limit 1
  `);
  console.log("\nQuery OK");
} catch (e) {
  console.log("\nQUERY ERROR:", e.message);
}

await client.end();
