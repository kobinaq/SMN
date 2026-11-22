import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Phase 2E, step 1 of 2: new optional block fields for the page import, and a
 * GraphQL-safe stored value for the "Content Marketing & Planning" category.
 * Additive and idempotent only; safe to run twice.
 *
 * Scaffolded with `npm run db:migrate:create`, then hardened by hand:
 * - The generator wanted to drop and recreate enum_posts_category and
 *   enum_resources_category to swap the "&" value. Instead the new value
 *   'Content Marketing and Planning' is added with ADD VALUE IF NOT EXISTS
 *   and the legacy value stays in the type (nothing is dropped or retyped).
 *   Rows move to the new value in the next migration, because PostgreSQL does
 *   not allow a new enum value to be used in the transaction that adds it.
 * - New image-preset enums are wrapped in duplicate_object guards and new
 *   columns use ADD COLUMN IF NOT EXISTS.
 *
 * `down` is intentionally empty, matching earlier phases.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_posts_category" ADD VALUE IF NOT EXISTS 'Content Marketing and Planning';
    ALTER TYPE "public"."enum_resources_category" ADD VALUE IF NOT EXISTS 'Content Marketing and Planning';

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_hero_image_preset" AS ENUM('hero-community', 'about-mission', 'founder', 'cohort-spotlight', 'mentorship-talk', 'event-workshop', 'academy-group', 'philosophy', 'post-strategy', 'hire-conversation');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_card_grid_cards_image_preset" AS ENUM('hero-community', 'about-mission', 'founder', 'cohort-spotlight', 'mentorship-talk', 'event-workshop', 'academy-group', 'philosophy', 'post-strategy', 'hire-conversation');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_founder_story_image_preset" AS ENUM('hero-community', 'about-mission', 'founder', 'cohort-spotlight', 'mentorship-talk', 'event-workshop', 'academy-group', 'philosophy', 'post-strategy', 'hire-conversation');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_hero_image_preset" AS ENUM('hero-community', 'about-mission', 'founder', 'cohort-spotlight', 'mentorship-talk', 'event-workshop', 'academy-group', 'philosophy', 'post-strategy', 'hire-conversation');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_card_grid_cards_image_preset" AS ENUM('hero-community', 'about-mission', 'founder', 'cohort-spotlight', 'mentorship-talk', 'event-workshop', 'academy-group', 'philosophy', 'post-strategy', 'hire-conversation');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_founder_story_image_preset" AS ENUM('hero-community', 'about-mission', 'founder', 'cohort-spotlight', 'mentorship-talk', 'event-workshop', 'academy-group', 'philosophy', 'post-strategy', 'hire-conversation');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "image_preset" "enum_pages_blocks_hero_image_preset";
    ALTER TABLE "pages_blocks_card_grid_cards" ADD COLUMN IF NOT EXISTS "meta" varchar;
    ALTER TABLE "pages_blocks_card_grid_cards" ADD COLUMN IF NOT EXISTS "audience" varchar;
    ALTER TABLE "pages_blocks_card_grid_cards" ADD COLUMN IF NOT EXISTS "image_preset" "enum_pages_blocks_card_grid_cards_image_preset";
    ALTER TABLE "pages_blocks_founder_story" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
    ALTER TABLE "pages_blocks_founder_story" ADD COLUMN IF NOT EXISTS "image_preset" "enum_pages_blocks_founder_story_image_preset";
    ALTER TABLE "pages_blocks_founder_story" ADD COLUMN IF NOT EXISTS "cta_label" varchar;
    ALTER TABLE "pages_blocks_founder_story" ADD COLUMN IF NOT EXISTS "cta_href" varchar;
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "image_preset" "enum__pages_v_blocks_hero_image_preset";
    ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD COLUMN IF NOT EXISTS "meta" varchar;
    ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD COLUMN IF NOT EXISTS "audience" varchar;
    ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD COLUMN IF NOT EXISTS "image_preset" "enum__pages_v_blocks_card_grid_cards_image_preset";
    ALTER TABLE "_pages_v_blocks_founder_story" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
    ALTER TABLE "_pages_v_blocks_founder_story" ADD COLUMN IF NOT EXISTS "image_preset" "enum__pages_v_blocks_founder_story_image_preset";
    ALTER TABLE "_pages_v_blocks_founder_story" ADD COLUMN IF NOT EXISTS "cta_label" varchar;
    ALTER TABLE "_pages_v_blocks_founder_story" ADD COLUMN IF NOT EXISTS "cta_href" varchar;
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op. See the file comment.
}
