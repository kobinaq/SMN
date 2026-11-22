import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Phase 1C: enrollment and payment links, enquiry types and statuses, and the
 * fixed One-on-One format. Additive and idempotent only; safe to run twice.
 *
 * Scaffolded with `npm run db:migrate:create`, then hardened by hand:
 * - Enum values are added with ADD VALUE IF NOT EXISTS. The generator wanted
 *   to recreate enum_enquiries_status only to reorder it; that is not needed.
 * - enum_payments_kind is touched only if it exists. On dev and prod
 *   payments.kind is a varchar column, so no type change is required there.
 * - enum_enrollments_source gains 'paystack' too: the config already lists it
 *   but older databases never got the value.
 * - Columns, indexes and foreign keys use IF NOT EXISTS or duplicate_object
 *   guards. Nothing is renamed, retyped or removed.
 * - Legacy rows are not rewritten. 'in-progress' enquiries keep their status.
 * - The One-on-One global gets the fixed 2 / 4 / 8 format only where a value
 *   is still NULL; staff-edited values are left alone.
 *
 * New enum values are not used in this migration, so ADD VALUE is safe inside
 * the migration transaction (PostgreSQL 12+).
 *
 * `down` is intentionally empty, matching 20261120_140000.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_enrollments_offering" AS ENUM('cohort', 'one-on-one');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TYPE "public"."enum_enrollments_program_type" ADD VALUE IF NOT EXISTS 'One-on-One' AFTER 'Cohort';
    ALTER TYPE "public"."enum_enrollments_source" ADD VALUE IF NOT EXISTS 'paystack';
    ALTER TYPE "public"."enum_enrollments_source" ADD VALUE IF NOT EXISTS 'enquiry';
    ALTER TYPE "public"."enum_enquiries_type" ADD VALUE IF NOT EXISTS 'cohort-application' AFTER 'programme-social-media-marketing';
    ALTER TYPE "public"."enum_enquiries_status" ADD VALUE IF NOT EXISTS 'contacted' AFTER 'new';
    ALTER TYPE "public"."enum_enquiries_status" ADD VALUE IF NOT EXISTS 'qualified' AFTER 'contacted';
    ALTER TYPE "public"."enum_enquiries_status" ADD VALUE IF NOT EXISTS 'converted' AFTER 'qualified';

    DO $$ BEGIN
      IF to_regtype('public.enum_payments_kind') IS NOT NULL THEN
        ALTER TYPE "public"."enum_payments_kind" ADD VALUE IF NOT EXISTS 'cohort';
        ALTER TYPE "public"."enum_payments_kind" ADD VALUE IF NOT EXISTS 'one-on-one';
      END IF;
    END $$;

    ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "offering" "public"."enum_enrollments_offering";
    ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "cohort_id" integer;
    ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "catalog_course_id" integer;
    ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "trainer_id" integer;
    ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "payment_id" integer;
    ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "source_enquiry_id" integer;
    ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cohort_id" integer;
    ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "owner_id" integer;
    ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "notes" varchar;
    ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "enrollment_id" integer;

    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_cohort_id_cohorts_id_fk"
        FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_catalog_course_id_courses_id_fk"
        FOREIGN KEY ("catalog_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_trainer_id_users_id_fk"
        FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_payment_id_payments_id_fk"
        FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_source_enquiry_id_enquiries_id_fk"
        FOREIGN KEY ("source_enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payments" ADD CONSTRAINT "payments_cohort_id_cohorts_id_fk"
        FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_owner_id_users_id_fk"
        FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_enrollment_id_enrollments_id_fk"
        FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "enrollments_offering_idx" ON "enrollments" USING btree ("offering");
    CREATE INDEX IF NOT EXISTS "enrollments_cohort_idx" ON "enrollments" USING btree ("cohort_id");
    CREATE INDEX IF NOT EXISTS "enrollments_catalog_course_idx" ON "enrollments" USING btree ("catalog_course_id");
    CREATE INDEX IF NOT EXISTS "enrollments_trainer_idx" ON "enrollments" USING btree ("trainer_id");
    CREATE INDEX IF NOT EXISTS "enrollments_payment_idx" ON "enrollments" USING btree ("payment_id");
    CREATE INDEX IF NOT EXISTS "enrollments_source_enquiry_idx" ON "enrollments" USING btree ("source_enquiry_id");
    CREATE INDEX IF NOT EXISTS "payments_cohort_idx" ON "payments" USING btree ("cohort_id");
    CREATE INDEX IF NOT EXISTS "enquiries_owner_idx" ON "enquiries" USING btree ("owner_id");
    CREATE INDEX IF NOT EXISTS "enquiries_enrollment_idx" ON "enquiries" USING btree ("enrollment_id");

    -- Fixed One-on-One format (decided): fill only missing values.
    UPDATE "one_on_one" SET "duration_weeks" = 2 WHERE "duration_weeks" IS NULL;
    UPDATE "one_on_one" SET "days_per_week" = 4 WHERE "days_per_week" IS NULL;
    UPDATE "one_on_one" SET "session_count" = 8 WHERE "session_count" IS NULL;
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op. See the file comment.
}
