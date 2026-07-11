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
const res = await client.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name
`);
console.log("Tables (" + res.rows.length + "):");
for (const row of res.rows) console.log(" -", row.table_name);
const members = res.rows.some((r) => r.table_name === "members");
console.log(members ? "\nOK: members table exists" : "\nMISSING: members table");
await client.end();
