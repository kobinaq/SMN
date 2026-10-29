import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Payload 3.90+ security schema additions (required when upgrading from 3.85.x):
 * - resetPasswordRequestedAt on auth collections (forgot-password throttle / lockout clear)
 * - _objectKey on upload collections (client-upload S3 overwrite hardening)
 *
 * Additive only. Existing media objects are not moved; _objectKey is populated for
 * new client uploads going forward.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
    ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
    ALTER TABLE "members" DROP COLUMN IF EXISTS "reset_password_requested_at";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
  `);
}
