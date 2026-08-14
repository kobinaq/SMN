import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_progress_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_learning_items_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_progress_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_learning_items_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "progress_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "learning_items_id";
    DROP TABLE IF EXISTS "progress" CASCADE;
    DROP TABLE IF EXISTS "learning_items" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_progress_status";
    DROP TYPE IF EXISTS "public"."enum_learning_items_kind";
    DROP TYPE IF EXISTS "public"."enum_learning_items_access_rule";
    DROP TYPE IF EXISTS "public"."enum_learning_items_status";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    SELECT 1;
  `);
}
