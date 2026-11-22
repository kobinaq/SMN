import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Phase 2E, step 2 of 2: move posts and resources from the legacy
 * 'Content Marketing & Planning' category value to the GraphQL-safe
 * 'Content Marketing and Planning' added in step 1. The visible label is
 * unchanged ("Content Marketing & Planning", via categoryLabel()).
 *
 * Idempotent: only rows still on the legacy value are touched, so a second run
 * changes nothing. No schema change; the legacy enum value is kept.
 *
 * `down` is intentionally empty.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "posts" SET "category" = 'Content Marketing and Planning' WHERE "category" = 'Content Marketing & Planning';
    UPDATE "resources" SET "category" = 'Content Marketing and Planning' WHERE "category" = 'Content Marketing & Planning';
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op. See the file comment.
}
