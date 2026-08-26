/**
 * Turning a database failure into something an operator can act on.
 *
 * When a deployed environment runs code whose collections have not been
 * migrated into its database yet, every staff page that touches a new table
 * throws during the server render. In production React strips the message, so
 * the operator sees an opaque "an error occurred" and has no way to tell a
 * schema drift apart from a genuine bug. These helpers name the difference.
 */

/** Postgres 42P01 / SQLite equivalents for "that table isn't there". */
const MISSING_RELATION = [
  /relation "([^"]+)" does not exist/i,
  /no such table:?\s*([\w.]+)/i,
  /table "?([\w.]+)"? does not exist/i,
];

export type DataFailure = {
  /** What to show the operator. */
  message: string;
  /** The concrete next step, when there is one. */
  hint?: string;
  /** Raw error text, for the details disclosure. */
  detail: string;
};

function errorText(error: unknown) {
  if (error instanceof Error) return `${error.message}${error.cause ? ` — ${String(error.cause)}` : ""}`;
  return String(error);
}

export function describeDataFailure(error: unknown, context: string): DataFailure {
  const detail = errorText(error);

  for (const pattern of MISSING_RELATION) {
    const match = detail.match(pattern);
    if (match) {
      return {
        message: `This environment's database is missing the “${match[1]}” table, so ${context} could not load.`,
        hint:
          "The deployed code expects collections that have not been migrated into this database yet. " +
          "Run `npm run db:migrate` against this environment's DATABASE_URL, then reload.",
        detail,
      };
    }
  }

  if (/ECONNREFUSED|ENOTFOUND|timeout|terminating connection|too many clients/i.test(detail)) {
    return {
      message: `The database did not answer, so ${context} could not load.`,
      hint: "Check this environment's DATABASE_URL and connection limits, then retry.",
      detail,
    };
  }

  return { message: `${context} could not load.`, detail };
}

/**
 * Run a page's queries and report a failure instead of throwing.
 *
 * A staff page that renders a named problem is worth more than one that 500s:
 * the operator learns whether to call a developer or run a migration.
 */
export async function loadOrDescribe<T>(
  context: string,
  load: () => Promise<T>,
): Promise<{ data: T; failure: null } | { data: null; failure: DataFailure }> {
  try {
    return { data: await load(), failure: null };
  } catch (error) {
    // Server-side log keeps the stack for whoever reads the platform logs.
    console.error(`[staff] ${context} failed to load`, error);
    return { data: null, failure: describeDataFailure(error, context) };
  }
}


/* ------------------------------------------------------------------------ *
 * Schema drift probe
 *
 * A deployed environment can be running code whose collections were never
 * migrated into its database. Rather than let each of the ~37 staff pages
 * discover that separately, probe once and let the staff chrome say it — one
 * check that covers every page, including the ones nobody has opened yet.
 * ------------------------------------------------------------------------ */

type Probe = { missing: string[]; checkedAt: number };

/** Cached per process. A migration needs a deploy or a manual run, so a short
 *  TTL is enough to clear the banner without probing on every request. */
let cachedProbe: Probe | null = null;
const PROBE_TTL_MS = 5 * 60 * 1000;

type ProbeClient = {
  config: { collections: Array<{ slug: string }> };
  find(args: Record<string, unknown>): Promise<unknown>;
};

/**
 * Returns the collections this database cannot answer for. The probe reads a
 * single row per collection — cheap enough to run behind the cache, and it
 * touches the same code path the pages use, so it cannot disagree with them.
 */
export async function probeSchema(payload: unknown): Promise<string[]> {
  const now = Date.now();
  if (cachedProbe && now - cachedProbe.checkedAt < PROBE_TTL_MS) return cachedProbe.missing;

  const client = payload as ProbeClient;
  const slugs = client.config?.collections?.map((collection) => collection.slug) ?? [];

  const results = await Promise.all(
    slugs.map(async (slug) => {
      try {
        await client.find({ collection: slug, limit: 1, depth: 0, pagination: false, overrideAccess: true });
        return null;
      } catch (error) {
        // Only schema drift belongs in this banner. A permissions or query
        // error on one collection is a different problem and would only make
        // the message wrong.
        const detail = errorText(error);
        return MISSING_RELATION.some((pattern) => pattern.test(detail)) ? slug : null;
      }
    }),
  );

  const missing = results.filter((slug): slug is string => Boolean(slug));
  cachedProbe = { missing, checkedAt: now };
  return missing;
}

/** Test seam: forget what the last probe found. */
export function resetSchemaProbe() {
  cachedProbe = null;
}
