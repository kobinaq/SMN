/**
 * Pure helpers for scripts/seed-courses.mjs. No I/O, so they can be unit tested.
 *
 * The seed may only run against the dev database endpoint. The same endpoint is
 * checked twice: from DATABASE_URL here, and again inside the SQL against what
 * the server reports in `neon.endpoint_id`.
 */
import {
  PREVIEW_DB_ENDPOINT_ID,
  databaseEndpointId,
  migrationDatabaseUrl,
} from "./deploy-migrate-guard.mjs";

export const SEED_ENDPOINT_ID = PREVIEW_DB_ENDPOINT_ID;

/**
 * Copy is taken word for word from `socialMediaProgram` in
 * src/lib/pages/programs.ts: paragraphs[0], "Who it's for" and
 * "What you'll develop".
 */
export const smmCourse = {
  slug: "social-media-marketing",
  title: "Social Media Marketing",
  summary: "Build the skills to plan, manage and deliver results for any brand or business.",
  outcomes: [
    "An understanding of social media marketing and its role in business.",
    "The ability to understand marketing objectives and translate them into social media strategies.",
    "Audience research and platform selection skills.",
    "Content planning and development skills.",
    "Social media page management and execution.",
    "Campaign planning and implementation.",
    "Performance measurement, reporting and evaluation.",
    "The ability to use relevant digital and AI tools to improve your workflow.",
  ],
  whoItsFor: [
    "Beginners looking to build a strong foundation in social media marketing.",
    "Students and graduates preparing to pursue opportunities in the field.",
    "Practising social media marketers looking to strengthen their approach.",
    "Business owners who want to understand and apply social media marketing to their businesses.",
  ],
};

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ ok: true, endpointId: string } | { ok: false, reason: string }}
 */
export function decideSeedTarget(env) {
  const url = migrationDatabaseUrl(env);
  if (!url) return { ok: false, reason: "DATABASE_URL is missing." };

  const parsed = databaseEndpointId(url);
  if (!parsed.parsed || !parsed.endpointId) {
    return { ok: false, reason: "DATABASE_URL could not be parsed." };
  }
  if (parsed.endpointId !== SEED_ENDPOINT_ID) {
    const shown = parsed.endpointId.startsWith("ep-") ? parsed.endpointId : "unrecognised";
    return {
      ok: false,
      reason: `Endpoint ${shown} is not the dev database. Seeding runs only against ${SEED_ENDPOINT_ID}.`,
    };
  }
  return { ok: true, endpointId: parsed.endpointId };
}

const TAG = "$seed$";

/** Dollar-quoted literal. Apostrophes need no escaping inside it. */
function lit(value) {
  if (value.includes(TAG)) throw new Error("Seed copy must not contain the quote tag.");
  return `${TAG}${value}${TAG}`;
}

function childRows(table, prefix, items) {
  return items
    .map((item, index) => {
      const n = String(index + 1).padStart(2, "0");
      return `    INSERT INTO "${table}" ("_order", "_parent_id", "id", "item")
    VALUES (${index + 1}, course_id, '${prefix}-${n}', ${lit(item)})
    ON CONFLICT ("id") DO UPDATE SET "_order" = EXCLUDED."_order", "_parent_id" = EXCLUDED."_parent_id", "item" = EXCLUDED."item";`;
    })
    .join("\n");
}

/** One idempotent statement. No removal of rows, no cohort, no price. */
export function smmSeedSql(course = smmCourse) {
  return `DO $$
DECLARE
  course_id integer;
BEGIN
  IF NOT coalesce(current_setting('neon.endpoint_id', true) = '${SEED_ENDPOINT_ID}', false) THEN
    RAISE EXCEPTION 'seed-courses refused: connected endpoint is not ${SEED_ENDPOINT_ID}';
  END IF;

  INSERT INTO "courses" ("title", "slug", "summary", "status", "currency", "certificate_enabled", "updated_at", "created_at")
  VALUES (${lit(course.title)}, '${course.slug}', ${lit(course.summary)}, 'published', 'GHS', true, now(), now())
  ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "summary" = EXCLUDED."summary",
    "status" = EXCLUDED."status",
    "currency" = EXCLUDED."currency",
    "certificate_enabled" = EXCLUDED."certificate_enabled",
    "updated_at" = now()
  RETURNING "id" INTO course_id;

${childRows("courses_outcomes", "seed-smm-outcome", course.outcomes)}
${childRows("courses_who_its_for", "seed-smm-who", course.whoItsFor)}
END $$;`;
}
