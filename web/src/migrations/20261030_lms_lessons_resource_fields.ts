import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * lms-lessons gained optional resourceLabel / resourceUrl fields in the
 * collection config, but no migration ever added the matching columns.
 * Databases built only from migrations therefore fail lesson SELECTs.
 * Production may already have them via push/dev mode — IF NOT EXISTS keeps
 * this a safe no-op there. No versions or locale tables exist for this
 * collection, so only lms_lessons needs the columns.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lms_lessons" ADD COLUMN IF NOT EXISTS "resource_label" varchar;
    ALTER TABLE "lms_lessons" ADD COLUMN IF NOT EXISTS "resource_url" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lms_lessons" DROP COLUMN IF EXISTS "resource_label";
    ALTER TABLE "lms_lessons" DROP COLUMN IF EXISTS "resource_url";
  `);
}
