/**
 * Shared guard for demo/seed scripts: they must never run against production.
 *
 * Refuses unless ALL hold:
 *  - ALLOW_DEMO_SEED is exactly "1"
 *  - VERCEL_ENV is not "production"
 *  - NODE_ENV is not "production"
 *  - the DATABASE_URL host is not on the PROD_DB_HOSTS denylist
 *
 * PROD_DB_HOSTS is a comma-separated list of hostnames (or Neon endpoint ids).
 * An entry matches the exact host, "<entry>.*" and "<entry>-pooler.*", case-insensitively.
 * Operators who hold production connection strings should set PROD_DB_HOSTS
 * wherever seeds could run. If it is unset the host check is a no-op.
 *
 * Messages never include the connection string, user or password.
 */

function hostOf(value) {
  const raw = (value ?? "").trim();
  if (!raw) return { ok: true, host: "" };
  try {
    return { ok: true, host: new URL(raw).hostname.toLowerCase() };
  } catch {
    return { ok: false, host: "" };
  }
}

export function decideDemoSeed(env = {}) {
  if (env.ALLOW_DEMO_SEED !== "1") {
    return { ok: false, reason: "ALLOW_DEMO_SEED=1 is required to run demo/seed scripts." };
  }
  if (env.VERCEL_ENV === "production") {
    return { ok: false, reason: "Refusing to seed: VERCEL_ENV is production." };
  }
  if (env.NODE_ENV === "production") {
    return { ok: false, reason: "Refusing to seed: NODE_ENV is production." };
  }
  const denylist = (env.PROD_DB_HOSTS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (denylist.length > 0) {
    for (const key of ["DATABASE_URL", "POSTGRES_URL", "DATABASE_URL_UNPOOLED"]) {
      const value = env[key];
      if (!value || !value.trim()) continue;
      const { ok, host } = hostOf(value);
      if (!ok) {
        return { ok: false, reason: `Refusing to seed: ${key} could not be parsed.` };
      }
      const hit = denylist.some(
        (entry) => host === entry || host.startsWith(`${entry}.`) || host.startsWith(`${entry}-pooler.`),
      );
      if (hit) {
        return { ok: false, reason: `Refusing to seed: ${key} host matches PROD_DB_HOSTS.` };
      }
    }
  }
  return { ok: true };
}

export function assertNonProd(env = {}) {
  const decision = decideDemoSeed(env);
  if (!decision.ok) throw new Error(decision.reason);
}

/** For scripts: reads process.env, prints the reason and exits non-zero on refusal. */
export function assertNonProdOrExit(label = "seed") {
  const decision = decideDemoSeed(process.env);
  if (!decision.ok) {
    console.error(`[${label}] ${decision.reason}`);
    process.exit(1);
  }
}
