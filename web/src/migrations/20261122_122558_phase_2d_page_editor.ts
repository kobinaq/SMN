import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Phase 2D: the page editor (Pages collection with its blocks and versions,
 * plus the Header and Footer globals with drafts and versions).
 * Additive and idempotent only; safe to run twice.
 *
 * Scaffolded with `npm run db:migrate:create`, then hardened by hand:
 * - Only new types, tables, indexes and foreign keys. No existing table is
 *   altered (Pages, Header and Footer set lockDocuments: false, so
 *   payload_locked_documents_rels is untouched).
 * - Types and foreign keys are wrapped in duplicate_object guards; tables and
 *   indexes use IF NOT EXISTS. Nothing is renamed, retyped or removed.
 *
 * `down` is intentionally empty, matching 20261120_140000 and Phase 1C.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_hero_buttons_style" AS ENUM('primary', 'secondary');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_card_grid_variant" AS ENUM('program-types', 'approaches', 'audiences');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_enquiry_form_enquiry_type" AS ENUM('programme-social-media-marketing', 'one-on-one-training', 'organisational-training', 'partnership', 'contact');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_price_panel_product" AS ENUM('course', 'one-on-one', 'workshops');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_hero_buttons_style" AS ENUM('primary', 'secondary');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_card_grid_variant" AS ENUM('program-types', 'approaches', 'audiences');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_enquiry_type" AS ENUM('programme-social-media-marketing', 'one-on-one-training', 'organisational-training', 'partnership', 'contact');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_price_panel_product" AS ENUM('course', 'one-on-one', 'workshops');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_header_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__header_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('instagram', 'linkedin', 'x', 'facebook', 'youtube', 'tiktok', 'whatsapp');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__footer_v_version_social_links_platform" AS ENUM('instagram', 'linkedin', 'x', 'facebook', 'youtube', 'tiktok', 'whatsapp');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "pages_blocks_hero_buttons" (
      	"_order" integer NOT NULL,
      	"_parent_id" varchar NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar,
      	"style" "enum_pages_blocks_hero_buttons_style" DEFAULT 'primary'
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_hero" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"headline" varchar,
      	"text" varchar,
      	"image_id" integer,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_text_section" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"body" jsonb,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_card_grid_cards" (
      	"_order" integer NOT NULL,
      	"_parent_id" varchar NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"title" varchar,
      	"text" varchar,
      	"image_id" integer,
      	"link_label" varchar,
      	"link_href" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_card_grid" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"intro" varchar,
      	"variant" "enum_pages_blocks_card_grid_variant" DEFAULT 'program-types',
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_founder_story" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"name" varchar,
      	"role" varchar,
      	"story" jsonb,
      	"image_id" integer,
      	"quote" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_steps_steps" (
      	"_order" integer NOT NULL,
      	"_parent_id" varchar NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"title" varchar,
      	"text" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_steps" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_faqs_items" (
      	"_order" integer NOT NULL,
      	"_parent_id" varchar NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"question" varchar,
      	"answer" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_faqs" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_cta_band" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"text" varchar,
      	"primary_label" varchar,
      	"primary_href" varchar,
      	"secondary_label" varchar,
      	"secondary_href" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_partner_logos_partners" (
      	"_order" integer NOT NULL,
      	"_parent_id" varchar NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"name" varchar,
      	"logo_id" integer,
      	"url" varchar,
      	"approved" boolean DEFAULT false
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_partner_logos" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_newsletter" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"text" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_enquiry_form" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"text" varchar,
      	"enquiry_type" "enum_pages_blocks_enquiry_form_enquiry_type" DEFAULT 'contact',
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_course_list" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"intro" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages_blocks_price_panel" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"product" "enum_pages_blocks_price_panel_product" DEFAULT 'course',
      	"course_id" integer,
      	"apply_link" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "pages" (
      	"id" serial PRIMARY KEY NOT NULL,
      	"title" varchar,
      	"slug" varchar,
      	"meta_title" varchar,
      	"meta_description" varchar,
      	"meta_image_id" integer,
      	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"_status" "enum_pages_status" DEFAULT 'draft'
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_buttons" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar,
      	"style" "enum__pages_v_blocks_hero_buttons_style" DEFAULT 'primary',
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"headline" varchar,
      	"text" varchar,
      	"image_id" integer,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_text_section" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"body" jsonb,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_card_grid_cards" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"title" varchar,
      	"text" varchar,
      	"image_id" integer,
      	"link_label" varchar,
      	"link_href" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_card_grid" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"intro" varchar,
      	"variant" "enum__pages_v_blocks_card_grid_variant" DEFAULT 'program-types',
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_founder_story" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"name" varchar,
      	"role" varchar,
      	"story" jsonb,
      	"image_id" integer,
      	"quote" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_steps_steps" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"title" varchar,
      	"text" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_steps" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faqs_items" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"question" varchar,
      	"answer" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faqs" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_band" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"text" varchar,
      	"primary_label" varchar,
      	"primary_href" varchar,
      	"secondary_label" varchar,
      	"secondary_href" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_logos_partners" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"name" varchar,
      	"logo_id" integer,
      	"url" varchar,
      	"approved" boolean DEFAULT false,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_logos" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_newsletter" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"text" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_enquiry_form" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"text" varchar,
      	"enquiry_type" "enum__pages_v_blocks_enquiry_form_enquiry_type" DEFAULT 'contact',
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_course_list" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"intro" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_price_panel" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"_path" text NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"product" "enum__pages_v_blocks_price_panel_product" DEFAULT 'course',
      	"course_id" integer,
      	"apply_link" varchar,
      	"_uuid" varchar,
      	"block_name" varchar
      );

    CREATE TABLE IF NOT EXISTS "_pages_v" (
      	"id" serial PRIMARY KEY NOT NULL,
      	"parent_id" integer,
      	"version_title" varchar,
      	"version_slug" varchar,
      	"version_meta_title" varchar,
      	"version_meta_description" varchar,
      	"version_meta_image_id" integer,
      	"version_updated_at" timestamp(3) with time zone,
      	"version_created_at" timestamp(3) with time zone,
      	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
      	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"latest" boolean,
      	"autosave" boolean
      );

    CREATE TABLE IF NOT EXISTS "header_nav_items" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar
      );

    CREATE TABLE IF NOT EXISTS "header" (
      	"id" serial PRIMARY KEY NOT NULL,
      	"cta_button_label" varchar,
      	"cta_button_href" varchar,
      	"sections_show_agency" boolean DEFAULT false,
      	"sections_show_events" boolean DEFAULT false,
      	"_status" "enum_header_status" DEFAULT 'draft',
      	"updated_at" timestamp(3) with time zone,
      	"created_at" timestamp(3) with time zone
      );

    CREATE TABLE IF NOT EXISTS "_header_v_version_nav_items" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_header_v" (
      	"id" serial PRIMARY KEY NOT NULL,
      	"version_cta_button_label" varchar,
      	"version_cta_button_href" varchar,
      	"version_sections_show_agency" boolean DEFAULT false,
      	"version_sections_show_events" boolean DEFAULT false,
      	"version__status" "enum__header_v_version_status" DEFAULT 'draft',
      	"version_updated_at" timestamp(3) with time zone,
      	"version_created_at" timestamp(3) with time zone,
      	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"latest" boolean
      );

    CREATE TABLE IF NOT EXISTS "footer_columns_links" (
      	"_order" integer NOT NULL,
      	"_parent_id" varchar NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar
      );

    CREATE TABLE IF NOT EXISTS "footer_columns" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"heading" varchar
      );

    CREATE TABLE IF NOT EXISTS "footer_legal_links" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar
      );

    CREATE TABLE IF NOT EXISTS "footer_social_links" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" varchar PRIMARY KEY NOT NULL,
      	"platform" "enum_footer_social_links_platform",
      	"url" varchar
      );

    CREATE TABLE IF NOT EXISTS "footer" (
      	"id" serial PRIMARY KEY NOT NULL,
      	"blurb" varchar,
      	"_status" "enum_footer_status" DEFAULT 'draft',
      	"updated_at" timestamp(3) with time zone,
      	"created_at" timestamp(3) with time zone
      );

    CREATE TABLE IF NOT EXISTS "_footer_v_version_columns_links" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_footer_v_version_columns" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"heading" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_footer_v_version_legal_links" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"label" varchar,
      	"href" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_footer_v_version_social_links" (
      	"_order" integer NOT NULL,
      	"_parent_id" integer NOT NULL,
      	"id" serial PRIMARY KEY NOT NULL,
      	"platform" "enum__footer_v_version_social_links_platform",
      	"url" varchar,
      	"_uuid" varchar
      );

    CREATE TABLE IF NOT EXISTS "_footer_v" (
      	"id" serial PRIMARY KEY NOT NULL,
      	"version_blurb" varchar,
      	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
      	"version_updated_at" timestamp(3) with time zone,
      	"version_created_at" timestamp(3) with time zone,
      	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      	"latest" boolean
      );

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_hero_buttons" ADD CONSTRAINT "pages_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_text_section" ADD CONSTRAINT "pages_blocks_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_founder_story" ADD CONSTRAINT "pages_blocks_founder_story_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_founder_story" ADD CONSTRAINT "pages_blocks_founder_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_steps_steps" ADD CONSTRAINT "pages_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_faqs_items" ADD CONSTRAINT "pages_blocks_faqs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faqs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_faqs" ADD CONSTRAINT "pages_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_partner_logos_partners" ADD CONSTRAINT "pages_blocks_partner_logos_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_partner_logos_partners" ADD CONSTRAINT "pages_blocks_partner_logos_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_logos"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_partner_logos" ADD CONSTRAINT "pages_blocks_partner_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_enquiry_form" ADD CONSTRAINT "pages_blocks_enquiry_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_course_list" ADD CONSTRAINT "pages_blocks_course_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_price_panel" ADD CONSTRAINT "pages_blocks_price_panel_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_price_panel" ADD CONSTRAINT "pages_blocks_price_panel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_text_section" ADD CONSTRAINT "_pages_v_blocks_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_founder_story" ADD CONSTRAINT "_pages_v_blocks_founder_story_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_founder_story" ADD CONSTRAINT "_pages_v_blocks_founder_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_steps_steps" ADD CONSTRAINT "_pages_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_faqs_items" ADD CONSTRAINT "_pages_v_blocks_faqs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faqs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_faqs" ADD CONSTRAINT "_pages_v_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_partner_logos_partners" ADD CONSTRAINT "_pages_v_blocks_partner_logos_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_partner_logos_partners" ADD CONSTRAINT "_pages_v_blocks_partner_logos_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_logos"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_partner_logos" ADD CONSTRAINT "_pages_v_blocks_partner_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_enquiry_form" ADD CONSTRAINT "_pages_v_blocks_enquiry_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_course_list" ADD CONSTRAINT "_pages_v_blocks_course_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_price_panel" ADD CONSTRAINT "_pages_v_blocks_price_panel_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_price_panel" ADD CONSTRAINT "_pages_v_blocks_price_panel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_header_v_version_nav_items" ADD CONSTRAINT "_header_v_version_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_footer_v_version_columns_links" ADD CONSTRAINT "_footer_v_version_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_footer_v_version_columns" ADD CONSTRAINT "_footer_v_version_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_footer_v_version_legal_links" ADD CONSTRAINT "_footer_v_version_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_footer_v_version_social_links" ADD CONSTRAINT "_footer_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_buttons_order_idx" ON "pages_blocks_hero_buttons" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_buttons_parent_id_idx" ON "pages_blocks_hero_buttons" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_text_section_order_idx" ON "pages_blocks_text_section" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_text_section_parent_id_idx" ON "pages_blocks_text_section" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_text_section_path_idx" ON "pages_blocks_text_section" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_cards_image_idx" ON "pages_blocks_card_grid_cards" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_founder_story_order_idx" ON "pages_blocks_founder_story" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_founder_story_parent_id_idx" ON "pages_blocks_founder_story" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_founder_story_path_idx" ON "pages_blocks_founder_story" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_founder_story_image_idx" ON "pages_blocks_founder_story" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_steps_steps_order_idx" ON "pages_blocks_steps_steps" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_steps_steps_parent_id_idx" ON "pages_blocks_steps_steps" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_faqs_items_order_idx" ON "pages_blocks_faqs_items" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_faqs_items_parent_id_idx" ON "pages_blocks_faqs_items" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_faqs_order_idx" ON "pages_blocks_faqs" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_faqs_parent_id_idx" ON "pages_blocks_faqs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_faqs_path_idx" ON "pages_blocks_faqs" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_logos_partners_order_idx" ON "pages_blocks_partner_logos_partners" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_logos_partners_parent_id_idx" ON "pages_blocks_partner_logos_partners" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_logos_partners_logo_idx" ON "pages_blocks_partner_logos_partners" USING btree ("logo_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_logos_order_idx" ON "pages_blocks_partner_logos" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_logos_parent_id_idx" ON "pages_blocks_partner_logos" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_logos_path_idx" ON "pages_blocks_partner_logos" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_enquiry_form_order_idx" ON "pages_blocks_enquiry_form" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_enquiry_form_parent_id_idx" ON "pages_blocks_enquiry_form" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_enquiry_form_path_idx" ON "pages_blocks_enquiry_form" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_course_list_order_idx" ON "pages_blocks_course_list" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_course_list_parent_id_idx" ON "pages_blocks_course_list" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_course_list_path_idx" ON "pages_blocks_course_list" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_price_panel_order_idx" ON "pages_blocks_price_panel" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "pages_blocks_price_panel_parent_id_idx" ON "pages_blocks_price_panel" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_price_panel_path_idx" ON "pages_blocks_price_panel" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_blocks_price_panel_course_idx" ON "pages_blocks_price_panel" USING btree ("course_id");

    CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");

    CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");

    CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");

    CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");

    CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_buttons_order_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_buttons_parent_id_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_section_order_idx" ON "_pages_v_blocks_text_section" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_section_parent_id_idx" ON "_pages_v_blocks_text_section" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_section_path_idx" ON "_pages_v_blocks_text_section" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_cards_order_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_cards_image_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_founder_story_order_idx" ON "_pages_v_blocks_founder_story" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_founder_story_parent_id_idx" ON "_pages_v_blocks_founder_story" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_founder_story_path_idx" ON "_pages_v_blocks_founder_story" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_founder_story_image_idx" ON "_pages_v_blocks_founder_story" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_steps_order_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_steps_parent_id_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faqs_items_order_idx" ON "_pages_v_blocks_faqs_items" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faqs_items_parent_id_idx" ON "_pages_v_blocks_faqs_items" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faqs_order_idx" ON "_pages_v_blocks_faqs" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faqs_parent_id_idx" ON "_pages_v_blocks_faqs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faqs_path_idx" ON "_pages_v_blocks_faqs" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_logos_partners_order_idx" ON "_pages_v_blocks_partner_logos_partners" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_logos_partners_parent_id_idx" ON "_pages_v_blocks_partner_logos_partners" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_logos_partners_logo_idx" ON "_pages_v_blocks_partner_logos_partners" USING btree ("logo_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_logos_order_idx" ON "_pages_v_blocks_partner_logos" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_logos_parent_id_idx" ON "_pages_v_blocks_partner_logos" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_logos_path_idx" ON "_pages_v_blocks_partner_logos" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_enquiry_form_order_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_enquiry_form_parent_id_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_enquiry_form_path_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_course_list_order_idx" ON "_pages_v_blocks_course_list" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_course_list_parent_id_idx" ON "_pages_v_blocks_course_list" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_course_list_path_idx" ON "_pages_v_blocks_course_list" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_price_panel_order_idx" ON "_pages_v_blocks_price_panel" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_price_panel_parent_id_idx" ON "_pages_v_blocks_price_panel" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_price_panel_path_idx" ON "_pages_v_blocks_price_panel" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_price_panel_course_idx" ON "_pages_v_blocks_price_panel" USING btree ("course_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");

    CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");

    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");

    CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");

    CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");

    CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");

    CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");

    CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");

    CREATE INDEX IF NOT EXISTS "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "header__status_idx" ON "header" USING btree ("_status");

    CREATE INDEX IF NOT EXISTS "_header_v_version_nav_items_order_idx" ON "_header_v_version_nav_items" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_header_v_version_nav_items_parent_id_idx" ON "_header_v_version_nav_items" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_header_v_version_version__status_idx" ON "_header_v" USING btree ("version__status");

    CREATE INDEX IF NOT EXISTS "_header_v_created_at_idx" ON "_header_v" USING btree ("created_at");

    CREATE INDEX IF NOT EXISTS "_header_v_updated_at_idx" ON "_header_v" USING btree ("updated_at");

    CREATE INDEX IF NOT EXISTS "_header_v_latest_idx" ON "_header_v" USING btree ("latest");

    CREATE INDEX IF NOT EXISTS "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer__status_idx" ON "footer" USING btree ("_status");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_columns_links_order_idx" ON "_footer_v_version_columns_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_columns_links_parent_id_idx" ON "_footer_v_version_columns_links" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_columns_order_idx" ON "_footer_v_version_columns" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_columns_parent_id_idx" ON "_footer_v_version_columns" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_legal_links_order_idx" ON "_footer_v_version_legal_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_legal_links_parent_id_idx" ON "_footer_v_version_legal_links" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_social_links_order_idx" ON "_footer_v_version_social_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_social_links_parent_id_idx" ON "_footer_v_version_social_links" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");

    CREATE INDEX IF NOT EXISTS "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");

    CREATE INDEX IF NOT EXISTS "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");

    CREATE INDEX IF NOT EXISTS "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op. See the file comment.
}
