import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_lms_courses_delivery" AS ENUM('self-paced', 'cohort');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "delivery" "enum_lms_courses_delivery" DEFAULT 'self-paced';
    UPDATE "lms_courses" SET "delivery" = 'self-paced' WHERE "delivery" IS NULL;
    ALTER TABLE "lms_courses" ALTER COLUMN "delivery" SET DEFAULT 'self-paced';
    ALTER TABLE "lms_courses" ALTER COLUMN "delivery" SET NOT NULL;

    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "start_date" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "application_deadline" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "duration" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "seats" numeric;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "audience" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "format" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "sessions" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "price_confirmed" boolean DEFAULT false;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "price_label" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "price_note" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "classroom_url" varchar;

    ALTER TABLE "lms_lessons" ADD COLUMN IF NOT EXISTS "classroom_url" varchar;
    ALTER TABLE "cohort_applications" ADD COLUMN IF NOT EXISTS "course_id" integer;

    DO $$ BEGIN
      ALTER TABLE "cohort_applications"
        ADD CONSTRAINT "cohort_applications_course_id_lms_courses_id_fk"
        FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "cohort_applications_course_idx" ON "cohort_applications" ("course_id");
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_lms_lessons_lesson_type" ADD VALUE IF NOT EXISTS 'classroom';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cohort_applications" DROP CONSTRAINT IF EXISTS "cohort_applications_course_id_lms_courses_id_fk";
    DROP INDEX IF EXISTS "cohort_applications_course_idx";
    ALTER TABLE "cohort_applications" DROP COLUMN IF EXISTS "course_id";
    ALTER TABLE "lms_lessons" DROP COLUMN IF EXISTS "classroom_url";
  `);
}
