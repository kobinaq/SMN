/**
 * Sits above every staff page when this environment's database is behind the
 * code. One banner in the chrome beats each of the ~37 pages discovering the
 * same thing separately — and it warns on pages nobody has opened yet, rather
 * than waiting for someone to hit the broken one.
 */
export function SchemaDriftBanner({ missing }: { missing: string[] }) {
  if (!missing.length) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-[var(--radius-lg)] border border-warn/40 bg-warn-bg px-5 py-4"
    >
      <p className="eyebrow text-warn">Database is behind the code</p>
      <p className="mt-2 text-sm leading-relaxed text-text-1">
        {missing.length === 1
          ? `The “${missing[0]}” collection has no table in this environment's database.`
          : `${missing.length} collections have no table in this environment's database: ${missing.join(", ")}.`}{" "}
        Pages that read {missing.length === 1 ? "it" : "them"} will fail until the schema catches up.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-2">
        Run <code className="font-mono text-text-1">npm run db:migrate</code>{" "}against this
        environment&rsquo;s <code className="font-mono text-text-1">DATABASE_URL</code>. Production
        deploys run migrations automatically; a database that predates that change needs one manual
        run.
      </p>
    </div>
  );
}
