import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Payload document locks store one FK column per collection on
 * payload_locked_documents_rels. Collections added after the baseline never
 * got those columns, so any save fails: Payload ORs every *_id in the lock query.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "cohort_applications_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "event_registrations_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "payments_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "lms_assessments_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "lms_submissions_id" integer;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cohort_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("cohort_applications_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("event_registrations_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_lms_assessments_id_idx" ON "payload_locked_documents_rels" USING btree ("lms_assessments_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_lms_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("lms_submissions_id");

    DO $$ BEGIN
      IF to_regclass('public.cohort_applications') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_cohort_applications_fk"
          FOREIGN KEY ("cohort_applications_id") REFERENCES "public"."cohort_applications"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF to_regclass('public.event_registrations') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk"
          FOREIGN KEY ("event_registrations_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF to_regclass('public.payments') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_payments_fk"
          FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF to_regclass('public.lms_assessments') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_lms_assessments_fk"
          FOREIGN KEY ("lms_assessments_id") REFERENCES "public"."lms_assessments"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF to_regclass('public.lms_submissions') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_lms_submissions_fk"
          FOREIGN KEY ("lms_submissions_id") REFERENCES "public"."lms_submissions"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_cohort_applications_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_event_registrations_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_payments_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_lms_assessments_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_lms_submissions_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_cohort_applications_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_event_registrations_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_payments_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_lms_assessments_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_lms_submissions_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cohort_applications_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "event_registrations_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payments_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "lms_assessments_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "lms_submissions_id";
  `);
}
