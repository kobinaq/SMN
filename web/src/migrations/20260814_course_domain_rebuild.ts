import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_lms_courses_commerce" AS ENUM('purchase', 'apply');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "commerce" "enum_lms_courses_commerce" DEFAULT 'purchase';
    UPDATE "lms_courses" SET "commerce" = 'purchase' WHERE "commerce" IS NULL;
    ALTER TABLE "lms_courses" ALTER COLUMN "commerce" SET DEFAULT 'purchase';
    ALTER TABLE "lms_courses" ALTER COLUMN "commerce" SET NOT NULL;

    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "amount" numeric;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "currency" varchar DEFAULT 'GHS';
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "price" varchar;
    ALTER TABLE "lms_courses" ADD COLUMN IF NOT EXISTS "badge" varchar;

    ALTER TABLE "lms_lessons" ADD COLUMN IF NOT EXISTS "session_at" timestamp(3) with time zone;

    UPDATE "lms_courses" AS lms
    SET
      "amount" = COALESCE(lms."amount", cat."amount"),
      "currency" = COALESCE(NULLIF(lms."currency", ''), cat."currency", 'GHS'),
      "price" = COALESCE(NULLIF(lms."price", ''), cat."price"),
      "badge" = COALESCE(NULLIF(lms."badge", ''), cat."badge")
    FROM "courses" AS cat
    WHERE cat."lms_course_id" = lms."id";

    ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "course_id" integer;
    ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "application_id" integer;

    UPDATE "payments" AS pay
    SET "course_id" = cat."lms_course_id"
    FROM "courses" AS cat
    WHERE pay."catalogue_course_id" = cat."id" AND pay."course_id" IS NULL AND cat."lms_course_id" IS NOT NULL;

    DO $$ BEGIN
      ALTER TABLE "payments"
        ADD CONSTRAINT "payments_course_id_lms_courses_id_fk"
        FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "payments"
        ADD CONSTRAINT "payments_application_id_cohort_applications_id_fk"
        FOREIGN KEY ("application_id") REFERENCES "public"."cohort_applications"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payments_course_idx" ON "payments" ("course_id");
    CREATE INDEX IF NOT EXISTS "payments_application_idx" ON "payments" ("application_id");
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_lms_assessments_kind" AS ENUM('assignment', 'quiz');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_lms_assessments_status" AS ENUM('draft', 'published', 'archived');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_lms_assessments_questions_type" AS ENUM('multiple-choice', 'short-answer');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_lms_submissions_status" AS ENUM('in-progress', 'submitted', 'graded', 'returned');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "lms_assessments" (
      "id" serial PRIMARY KEY NOT NULL,
      "course_id" integer NOT NULL,
      "module_id" integer,
      "lesson_id" integer,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "kind" "enum_lms_assessments_kind" DEFAULT 'assignment' NOT NULL,
      "instructions" varchar NOT NULL,
      "available_from" timestamp(3) with time zone,
      "due_at" timestamp(3) with time zone,
      "allow_late" boolean DEFAULT false,
      "max_attempts" numeric DEFAULT 1,
      "total_marks" numeric DEFAULT 0,
      "order" numeric DEFAULT 0,
      "status" "enum_lms_assessments_status" DEFAULT 'draft' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_assessments_questions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "prompt" varchar NOT NULL,
      "type" "enum_lms_assessments_questions_type" DEFAULT 'multiple-choice' NOT NULL,
      "answer" varchar,
      "marks" numeric DEFAULT 1 NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_assessments_questions_options" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "option" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_assessments_rubric" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "criterion" varchar NOT NULL,
      "description" varchar
    );

    CREATE TABLE IF NOT EXISTS "lms_assessments_rubric_levels" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "descriptor" varchar,
      "marks" numeric NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "assessment_id" integer NOT NULL,
      "course_id" integer NOT NULL,
      "member_id" integer NOT NULL,
      "attempt_number" numeric DEFAULT 1 NOT NULL,
      "status" "enum_lms_submissions_status" DEFAULT 'in-progress' NOT NULL,
      "answers" jsonb,
      "text_response" varchar,
      "late" boolean DEFAULT false,
      "submitted_at" timestamp(3) with time zone,
      "score" numeric,
      "max_score" numeric,
      "feedback" varchar,
      "graded_by_id" integer,
      "graded_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_submissions_files" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "file_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "lms_submissions_rubric_scores" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "criterion" varchar NOT NULL,
      "marks" numeric NOT NULL,
      "comment" varchar
    );
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "lms_assessments"
        ADD CONSTRAINT "lms_assessments_course_id_lms_courses_id_fk"
        FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_assessments_questions"
        ADD CONSTRAINT "lms_assessments_questions_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_assessments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_assessments_questions_options"
        ADD CONSTRAINT "lms_assessments_questions_options_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_assessments_questions"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_assessments_rubric"
        ADD CONSTRAINT "lms_assessments_rubric_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_assessments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_assessments_rubric_levels"
        ADD CONSTRAINT "lms_assessments_rubric_levels_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_assessments_rubric"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_submissions"
        ADD CONSTRAINT "lms_submissions_assessment_id_lms_assessments_id_fk"
        FOREIGN KEY ("assessment_id") REFERENCES "public"."lms_assessments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_submissions"
        ADD CONSTRAINT "lms_submissions_course_id_lms_courses_id_fk"
        FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_submissions"
        ADD CONSTRAINT "lms_submissions_member_id_members_id_fk"
        FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_submissions_files"
        ADD CONSTRAINT "lms_submissions_files_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_submissions"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "lms_submissions_rubric_scores"
        ADD CONSTRAINT "lms_submissions_rubric_scores_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_submissions"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "lms_assessments_course_idx" ON "lms_assessments" ("course_id");
    CREATE INDEX IF NOT EXISTS "lms_assessments_slug_idx" ON "lms_assessments" ("slug");
    CREATE INDEX IF NOT EXISTS "lms_submissions_assessment_idx" ON "lms_submissions" ("assessment_id");
    CREATE INDEX IF NOT EXISTS "lms_submissions_member_idx" ON "lms_submissions" ("member_id");
    CREATE INDEX IF NOT EXISTS "lms_submissions_course_idx" ON "lms_submissions" ("course_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "lms_submissions_rubric_scores" CASCADE;
    DROP TABLE IF EXISTS "lms_submissions_files" CASCADE;
    DROP TABLE IF EXISTS "lms_submissions" CASCADE;
    DROP TABLE IF EXISTS "lms_assessments_rubric_levels" CASCADE;
    DROP TABLE IF EXISTS "lms_assessments_rubric" CASCADE;
    DROP TABLE IF EXISTS "lms_assessments_questions_options" CASCADE;
    DROP TABLE IF EXISTS "lms_assessments_questions" CASCADE;
    DROP TABLE IF EXISTS "lms_assessments" CASCADE;
    ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_course_id_lms_courses_id_fk";
    ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_application_id_cohort_applications_id_fk";
    DROP INDEX IF EXISTS "payments_course_idx";
    DROP INDEX IF EXISTS "payments_application_idx";
    ALTER TABLE "payments" DROP COLUMN IF EXISTS "course_id";
    ALTER TABLE "payments" DROP COLUMN IF EXISTS "application_id";
    ALTER TABLE "lms_lessons" DROP COLUMN IF EXISTS "session_at";
  `);
}
