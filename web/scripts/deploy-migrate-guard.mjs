/**
 * Decides whether `vercel-build` should run Payload migrations.
 *
 * The migrate script and Payload's Postgres adapter both read DATABASE_URL.
 * POSTGRES_URL and DATABASE_URL_UNPOOLED are not consulted. The preview guard
 * parses that same DATABASE_URL and fails closed.
 */

export const PREVIEW_DB_ENDPOINT_ID = "ep-wispy-rice-abpfeozn";
export const PRODUCTION_DB_ENDPOINT_ID = "ep-holy-bonus-ab5c6fnt";

export function migrationDatabaseUrl(env) {
  const value = env.DATABASE_URL;
  if (typeof value !== "string") return "";
  return value.trim();
}

function hostnameMatchesEndpoint(hostname, endpointId) {
  return hostname.startsWith(`${endpointId}.`) || hostname.startsWith(`${endpointId}-`);
}

function endpointIdFromHostname(hostname) {
  const label = hostname.split(".")[0] ?? "";
  if (label.endsWith("-pooler")) return label.slice(0, -"-pooler".length);
  return label;
}

export function databaseEndpointId(connectionString) {
  let hostname = "";
  try {
    hostname = new URL(connectionString).hostname;
  } catch {
    return { parsed: false, endpointId: null };
  }
  if (!hostname) return { parsed: false, endpointId: null };
  const endpointId = endpointIdFromHostname(hostname);
  return { parsed: true, endpointId, hostname };
}

function previewRefusal(detail) {
  return {
    action: "fail",
    message:
      `[deploy] Preview migrate refused. ${detail} ` +
      `Preview migrations run only against endpoint ${PREVIEW_DB_ENDPOINT_ID}.`,
  };
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ action: "skip" | "migrate" | "fail", message: string }}
 */
export function decideDeployMigration(env) {
  const vercelEnv = typeof env.VERCEL_ENV === "string" ? env.VERCEL_ENV : "";

  if (vercelEnv !== "production" && vercelEnv !== "preview") {
    const shown = vercelEnv || "unset";
    return {
      action: "skip",
      message:
        `[deploy] VERCEL_ENV=${shown}, skipping migrations. ` +
        "Only production and guarded preview deploys migrate. Run `npm run db:migrate` by hand for other environments.",
    };
  }

  const databaseUrl = migrationDatabaseUrl(env);

  if (vercelEnv === "production") {
    if (!databaseUrl) {
      return {
        action: "fail",
        message: "[deploy] Production build has no DATABASE_URL; refusing to continue.",
      };
    }
    return {
      action: "migrate",
      message: "[deploy] Production deploy — running Payload migrations before the build.",
    };
  }

  if (!databaseUrl) {
    return previewRefusal("DATABASE_URL is missing.");
  }

  const parsed = databaseEndpointId(databaseUrl);
  if (!parsed.parsed || !parsed.hostname) {
    return previewRefusal("DATABASE_URL could not be parsed.");
  }

  if (hostnameMatchesEndpoint(parsed.hostname, PRODUCTION_DB_ENDPOINT_ID)) {
    return previewRefusal(`Endpoint id ${PRODUCTION_DB_ENDPOINT_ID} is production.`);
  }

  if (hostnameMatchesEndpoint(parsed.hostname, PREVIEW_DB_ENDPOINT_ID)) {
    return {
      action: "migrate",
      message:
        `[deploy] Preview deploy, database endpoint ${PREVIEW_DB_ENDPOINT_ID}, running Payload migrations before the build.`,
    };
  }

  const loggedId = parsed.endpointId?.startsWith("ep-") ? parsed.endpointId : "unrecognized";
  return previewRefusal(`Endpoint id ${loggedId} is not the dev database.`);
}
