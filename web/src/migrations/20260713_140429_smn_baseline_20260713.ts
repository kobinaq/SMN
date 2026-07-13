import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'content', 'learning', 'mentorship', 'opportunity', 'support', 'analyst');
  CREATE TYPE "public"."enum_members_roles" AS ENUM('member', 'mentor', 'employer', 'alumni');
  CREATE TYPE "public"."enum_members_cohort_status" AS ENUM('none', 'applicant', 'active', 'completed');
  CREATE TYPE "public"."enum_members_visibility" AS ENUM('private', 'members', 'public');
  CREATE TYPE "public"."enum_mentors_topics" AS ENUM('Brand strategy', 'Content strategy', 'Social media', 'AI workflows', 'B2B marketing', 'Growth marketing', 'Portfolio reviews', 'Career development');
  CREATE TYPE "public"."enum_mentors_seniority" AS ENUM('Mid-level', 'Senior', 'Lead / Head', 'Founder / Executive');
  CREATE TYPE "public"."enum_mentors_availability" AS ENUM('Available', 'Limited', 'Unavailable');
  CREATE TYPE "public"."enum_mentors_status" AS ENUM('draft', 'approved', 'paused', 'rejected');
  CREATE TYPE "public"."enum_mentorship_requests_topic" AS ENUM('Brand strategy', 'Content strategy', 'Social media', 'AI workflows', 'B2B marketing', 'Growth marketing', 'Portfolio reviews', 'Career development');
  CREATE TYPE "public"."enum_mentorship_requests_preferred_format" AS ENUM('Video call', 'Portfolio review', 'Async feedback', 'Group office hours');
  CREATE TYPE "public"."enum_mentorship_requests_status" AS ENUM('new', 'reviewing', 'introduced', 'completed', 'declined');
  CREATE TYPE "public"."enum_mentorship_relationships_status" AS ENUM('proposed', 'active', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_opportunity_sources_type" AS ENUM('greenhouse', 'lever', 'ashby');
  CREATE TYPE "public"."enum_opportunities_type" AS ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Volunteer');
  CREATE TYPE "public"."enum_opportunities_work_mode" AS ENUM('Remote', 'Hybrid', 'On-site', 'Unspecified');
  CREATE TYPE "public"."enum_opportunities_experience_level" AS ENUM('Entry level', 'Mid-level', 'Senior', 'Lead / Head', 'Any level');
  CREATE TYPE "public"."enum_opportunities_source_label" AS ENUM('manual', 'partner', 'imported');
  CREATE TYPE "public"."enum_opportunities_status" AS ENUM('pending', 'published', 'closed', 'archived');
  CREATE TYPE "public"."enum_opportunity_applications_status" AS ENUM('started', 'applied', 'interviewing', 'offered', 'declined', 'withdrawn');
  CREATE TYPE "public"."enum_enrollments_program_type" AS ENUM('Cohort', 'Self-paced course', 'Workshop', 'Community track');
  CREATE TYPE "public"."enum_enrollments_source" AS ENUM('staff', 'cohort', 'selar');
  CREATE TYPE "public"."enum_enrollments_status" AS ENUM('active', 'completed', 'paused', 'cancelled');
  CREATE TYPE "public"."enum_learning_items_kind" AS ENUM('Milestone', 'Classroom session', 'Resource', 'Assignment', 'External course', 'Announcement');
  CREATE TYPE "public"."enum_learning_items_access_rule" AS ENUM('member', 'enrolled', 'cohort');
  CREATE TYPE "public"."enum_learning_items_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_progress_status" AS ENUM('not-started', 'in-progress', 'completed');
  CREATE TYPE "public"."enum_lms_courses_tutor_modes" AS ENUM('explain', 'simplify', 'example', 'summary', 'revision', 'socratic', 'feedback', 'compare', 'next-lesson');
  CREATE TYPE "public"."enum_lms_courses_access_rule" AS ENUM('enrolled', 'member', 'cohort');
  CREATE TYPE "public"."enum_lms_courses_level" AS ENUM('foundation', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_lms_courses_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_lms_modules_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_lms_lessons_lesson_type" AS ENUM('video', 'reading', 'download', 'assignment');
  CREATE TYPE "public"."enum_lms_lessons_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_lms_lesson_progress_status" AS ENUM('not-started', 'in-progress', 'completed');
  CREATE TYPE "public"."enum_portfolios_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_portfolios_visibility" AS ENUM('private', 'members', 'public');
  CREATE TYPE "public"."enum_certificates_notification_status" AS ENUM('pending', 'sent', 'skipped', 'failed');
  CREATE TYPE "public"."enum_certificates_status" AS ENUM('draft', 'valid', 'revoked');
  CREATE TYPE "public"."enum_certificates_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_audit_events_visibility" AS ENUM('staff', 'member-visible');
  CREATE TYPE "public"."enum_member_notes_category" AS ENUM('support', 'learning', 'mentorship', 'opportunity', 'conduct', 'other');
  CREATE TYPE "public"."enum_ai_usage_records_actor_type" AS ENUM('member', 'staff', 'system');
  CREATE TYPE "public"."enum_ai_usage_records_feature" AS ENUM('tutor', 'content-studio', 'career-coach', 'retrieval', 'tool');
  CREATE TYPE "public"."enum_ai_usage_records_status" AS ENUM('success', 'declined', 'error', 'timeout', 'limited');
  CREATE TYPE "public"."enum_ai_feedback_feature" AS ENUM('tutor', 'content-studio', 'career-coach');
  CREATE TYPE "public"."enum_ai_feedback_rating" AS ENUM('helpful', 'not-helpful');
  CREATE TYPE "public"."enum_ai_feedback_reason" AS ENUM('incorrect', 'unsupported', 'unclear', 'unsafe', 'irrelevant', 'other');
  CREATE TYPE "public"."enum_ai_knowledge_sources_kind" AS ENUM('transcript', 'note', 'resource', 'faq', 'attachment-text');
  CREATE TYPE "public"."enum_ai_drafts_kind" AS ENUM('course-outline', 'lesson-outline', 'lesson', 'example', 'quiz', 'rubric', 'revision', 'faq');
  CREATE TYPE "public"."enum_ai_drafts_status" AS ENUM('draft', 'selected', 'rejected', 'saved');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('Marketing Strategy', 'AI', 'Social Media', 'Career Development', 'Case Studies', 'Industry Trends', 'Community Stories');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('published', 'coming-soon');
  CREATE TYPE "public"."enum_events_type" AS ENUM('Webinar', 'Workshop', 'Networking', 'Conference');
  CREATE TYPE "public"."enum_resources_type" AS ENUM('Template', 'Guide', 'AI Prompts', 'Checklist', 'Toolkit', 'Download');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'super-admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "members_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skill" varchar NOT NULL
  );
  
  CREATE TABLE "members_career_interests" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"interest" varchar NOT NULL
  );
  
  CREATE TABLE "members_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_members_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "members_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"handle" varchar,
  	"headline" varchar,
  	"bio" varchar,
  	"career_goals" varchar,
  	"location" varchar,
  	"linkedin" varchar,
  	"portfolio_url" varchar,
  	"avatar_id" integer,
  	"cohort_status" "enum_members_cohort_status" DEFAULT 'none',
  	"visibility" "enum_members_visibility" DEFAULT 'private',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "mentors_topics" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_mentors_topics",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "mentors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"seniority" "enum_mentors_seniority" NOT NULL,
  	"availability" "enum_mentors_availability" DEFAULT 'Limited' NOT NULL,
  	"max_active_mentees" numeric DEFAULT 3 NOT NULL,
  	"booking_url" varchar,
  	"status" "enum_mentors_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"approved_at" timestamp(3) with time zone,
  	"approved_by_id" integer,
  	"rejection_reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mentorship_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"requester_id" integer NOT NULL,
  	"mentor_id" integer NOT NULL,
  	"topic" "enum_mentorship_requests_topic" NOT NULL,
  	"goal" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"preferred_format" "enum_mentorship_requests_preferred_format" DEFAULT 'Video call' NOT NULL,
  	"status" "enum_mentorship_requests_status" DEFAULT 'new' NOT NULL,
  	"staff_notes" varchar,
  	"decision_reason" varchar,
  	"mentor_response" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mentorship_relationships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"request_id" integer NOT NULL,
  	"mentor_id" integer NOT NULL,
  	"mentee_id" integer NOT NULL,
  	"status" "enum_mentorship_relationships_status" DEFAULT 'active' NOT NULL,
  	"started_at" timestamp(3) with time zone,
  	"ended_at" timestamp(3) with time zone,
  	"mentor_response" varchar,
  	"mentee_feedback" varchar,
  	"mentor_feedback" varchar,
  	"staff_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "opportunity_sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_opportunity_sources_type" NOT NULL,
  	"board_token" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"auto_publish" boolean DEFAULT false,
  	"minimum_score" numeric DEFAULT 2,
  	"default_location" varchar,
  	"last_synced_at" timestamp(3) with time zone,
  	"last_error" varchar,
  	"consecutive_failures" numeric DEFAULT 0,
  	"last_fetched_count" numeric DEFAULT 0,
  	"last_created_count" numeric DEFAULT 0,
  	"last_updated_count" numeric DEFAULT 0,
  	"last_skipped_count" numeric DEFAULT 0,
  	"last_duration_ms" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "opportunities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_opportunities_type" NOT NULL,
  	"work_mode" "enum_opportunities_work_mode" NOT NULL,
  	"experience_level" "enum_opportunities_experience_level" NOT NULL,
  	"location" varchar NOT NULL,
  	"salary" varchar,
  	"application_url" varchar NOT NULL,
  	"source_id" integer,
  	"external_id" varchar,
  	"fingerprint" varchar,
  	"source_label" "enum_opportunities_source_label" DEFAULT 'manual' NOT NULL,
  	"relevance_score" numeric,
  	"status" "enum_opportunities_status" DEFAULT 'pending' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"last_seen_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "opportunity_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"opportunity_id" integer NOT NULL,
  	"status" "enum_opportunity_applications_status" DEFAULT 'started' NOT NULL,
  	"applied_at" timestamp(3) with time zone,
  	"member_notes" varchar,
  	"staff_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enrollments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"program_name" varchar NOT NULL,
  	"program_key" varchar NOT NULL,
  	"course_id" integer,
  	"program_type" "enum_enrollments_program_type" NOT NULL,
  	"source" "enum_enrollments_source" DEFAULT 'staff' NOT NULL,
  	"external_reference" varchar,
  	"status" "enum_enrollments_status" DEFAULT 'active' NOT NULL,
  	"classroom_url" varchar,
  	"course_url" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"started_at" timestamp(3) with time zone,
  	"last_activity_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"completion_percent" numeric DEFAULT 0,
  	"certificate_eligible" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "learning_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"program_key" varchar NOT NULL,
  	"kind" "enum_learning_items_kind" NOT NULL,
  	"week" numeric DEFAULT 0,
  	"order" numeric DEFAULT 0,
  	"estimated_minutes" numeric,
  	"access_rule" "enum_learning_items_access_rule" DEFAULT 'enrolled' NOT NULL,
  	"external_url" varchar,
  	"resource_id" integer,
  	"status" "enum_learning_items_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "progress" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"learning_item_id" integer NOT NULL,
  	"enrollment_id" integer,
  	"status" "enum_progress_status" DEFAULT 'not-started' NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lms_courses_learning_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"outcome" varchar NOT NULL
  );
  
  CREATE TABLE "lms_courses_tutor_modes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_lms_courses_tutor_modes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "lms_courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"instructor" varchar,
  	"category" varchar,
  	"prerequisites" varchar,
  	"program_key" varchar NOT NULL,
  	"access_rule" "enum_lms_courses_access_rule" DEFAULT 'enrolled' NOT NULL,
  	"level" "enum_lms_courses_level" DEFAULT 'foundation',
  	"cover_id" integer,
  	"estimated_hours" numeric,
  	"enrollment_open" boolean DEFAULT true,
  	"certificate_enabled" boolean DEFAULT false,
  	"preview_enabled" boolean DEFAULT false,
  	"tutor_enabled" boolean DEFAULT false,
  	"tutor_guidance" varchar,
  	"order" numeric DEFAULT 0,
  	"status" "enum_lms_courses_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lms_modules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar,
  	"order" numeric DEFAULT 0,
  	"status" "enum_lms_modules_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lms_lessons_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "lms_lessons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" integer NOT NULL,
  	"module_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"lesson_type" "enum_lms_lessons_lesson_type" DEFAULT 'video' NOT NULL,
  	"youtube_url" varchar,
  	"duration_minutes" numeric,
  	"body" varchar,
  	"order" numeric DEFAULT 0,
  	"status" "enum_lms_lessons_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lms_lesson_progress" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"course_id" integer NOT NULL,
  	"lesson_id" integer NOT NULL,
  	"status" "enum_lms_lesson_progress_status" DEFAULT 'not-started' NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolios_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skill" varchar NOT NULL
  );
  
  CREATE TABLE "portfolios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"challenge" varchar NOT NULL,
  	"approach" varchar NOT NULL,
  	"outcome" varchar NOT NULL,
  	"project_url" varchar,
  	"cover_id" integer,
  	"cover_url" varchar,
  	"status" "enum_portfolios_status" DEFAULT 'draft' NOT NULL,
  	"visibility" "enum_portfolios_visibility" DEFAULT 'private' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certificates_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skill" varchar NOT NULL
  );
  
  CREATE TABLE "certificates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"program_name" varchar NOT NULL,
  	"program_key" varchar,
  	"course_id" integer,
  	"enrollment_id" integer,
  	"issued_by_id" integer NOT NULL,
  	"active_issuance_key" varchar,
  	"credential_code" varchar NOT NULL,
  	"summary" varchar,
  	"pdf_id" integer,
  	"issued_at" timestamp(3) with time zone NOT NULL,
  	"expires_at" timestamp(3) with time zone,
  	"reissued_from_id" integer,
  	"revoked_at" timestamp(3) with time zone,
  	"revoked_by_id" integer,
  	"revocation_reason" varchar,
  	"notification_status" "enum_certificates_notification_status" DEFAULT 'pending',
  	"status" "enum_certificates_status" DEFAULT 'valid' NOT NULL,
  	"visibility" "enum_certificates_visibility" DEFAULT 'public' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"actor_id" integer NOT NULL,
  	"action" varchar NOT NULL,
  	"entity_type" varchar NOT NULL,
  	"entity_id" varchar NOT NULL,
  	"reason" varchar NOT NULL,
  	"before" jsonb,
  	"after" jsonb,
  	"visibility" "enum_audit_events_visibility" DEFAULT 'staff' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "member_notes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"author_id" integer NOT NULL,
  	"category" "enum_member_notes_category" DEFAULT 'support' NOT NULL,
  	"note" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_usage_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"actor_type" "enum_ai_usage_records_actor_type" NOT NULL,
  	"actor_key" varchar NOT NULL,
  	"feature" "enum_ai_usage_records_feature" NOT NULL,
  	"operation" varchar NOT NULL,
  	"provider" varchar,
  	"model" varchar,
  	"status" "enum_ai_usage_records_status" NOT NULL,
  	"input_chars" numeric,
  	"output_chars" numeric,
  	"input_tokens" numeric,
  	"output_tokens" numeric,
  	"latency_ms" numeric,
  	"source_count" numeric,
  	"prompt_hash" varchar,
  	"error_code" varchar,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_feedback" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"feature" "enum_ai_feedback_feature" NOT NULL,
  	"context_key" varchar,
  	"rating" "enum_ai_feedback_rating" NOT NULL,
  	"reason" "enum_ai_feedback_reason",
  	"comment" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_knowledge_sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" integer NOT NULL,
  	"lesson_id" integer,
  	"kind" "enum_ai_knowledge_sources_kind" NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"citation_label" varchar NOT NULL,
  	"approved" boolean DEFAULT false,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_drafts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" integer NOT NULL,
  	"lesson_id" integer,
  	"kind" "enum_ai_drafts_kind" NOT NULL,
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"status" "enum_ai_drafts_status" DEFAULT 'draft' NOT NULL,
  	"version" numeric DEFAULT 1 NOT NULL,
  	"parent_draft_id" integer,
  	"created_by_id" integer NOT NULL,
  	"provenance" jsonb NOT NULL,
  	"controls" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_career_states" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"goal_summary" varchar,
  	"confirmed_plan" jsonb,
  	"saved_opportunity_ids" jsonb,
  	"saved_course_ids" jsonb,
  	"conversation_summary" varchar,
  	"retention_consent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_posts_category" NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" jsonb,
  	"cover_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"read_time" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"duration" varchar,
  	"lessons" numeric,
  	"price" varchar,
  	"selar_url" varchar NOT NULL,
  	"badge" varchar,
  	"image_id" integer,
  	"status" "enum_courses_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_events_type" NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"time" varchar,
  	"summary" varchar NOT NULL,
  	"registration_url" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_resources_type" NOT NULL,
  	"description" varchar NOT NULL,
  	"file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"members_id" integer,
  	"mentors_id" integer,
  	"mentorship_requests_id" integer,
  	"mentorship_relationships_id" integer,
  	"opportunity_sources_id" integer,
  	"opportunities_id" integer,
  	"opportunity_applications_id" integer,
  	"enrollments_id" integer,
  	"learning_items_id" integer,
  	"progress_id" integer,
  	"lms_courses_id" integer,
  	"lms_modules_id" integer,
  	"lms_lessons_id" integer,
  	"lms_lesson_progress_id" integer,
  	"portfolios_id" integer,
  	"certificates_id" integer,
  	"audit_events_id" integer,
  	"member_notes_id" integer,
  	"ai_usage_records_id" integer,
  	"ai_feedback_id" integer,
  	"ai_knowledge_sources_id" integer,
  	"ai_drafts_id" integer,
  	"ai_career_states_id" integer,
  	"media_id" integer,
  	"posts_id" integer,
  	"courses_id" integer,
  	"events_id" integer,
  	"stories_id" integer,
  	"resources_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"members_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Social Marketers Network' NOT NULL,
  	"tagline" varchar,
  	"whatsapp_invite" varchar,
  	"ops_email" varchar,
  	"cohort_name" varchar,
  	"cohort_start_date" varchar,
  	"cohort_duration" varchar,
  	"cohort_seats" numeric,
  	"cohort_price_label" varchar,
  	"cohort_price_note" varchar,
  	"cohort_sessions" varchar,
  	"social_instagram" varchar,
  	"social_linkedin" varchar,
  	"social_twitter" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members_skills" ADD CONSTRAINT "members_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members_career_interests" ADD CONSTRAINT "members_career_interests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members_roles" ADD CONSTRAINT "members_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members_sessions" ADD CONSTRAINT "members_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members" ADD CONSTRAINT "members_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mentors_topics" ADD CONSTRAINT "mentors_topics_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mentors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mentors" ADD CONSTRAINT "mentors_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mentors" ADD CONSTRAINT "mentors_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_requester_id_members_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentor_id_mentors_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mentorship_relationships" ADD CONSTRAINT "mentorship_relationships_request_id_mentorship_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."mentorship_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mentorship_relationships" ADD CONSTRAINT "mentorship_relationships_mentor_id_mentors_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mentorship_relationships" ADD CONSTRAINT "mentorship_relationships_mentee_id_members_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_source_id_opportunity_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."opportunity_sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "learning_items" ADD CONSTRAINT "learning_items_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "progress" ADD CONSTRAINT "progress_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "progress" ADD CONSTRAINT "progress_learning_item_id_learning_items_id_fk" FOREIGN KEY ("learning_item_id") REFERENCES "public"."learning_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "progress" ADD CONSTRAINT "progress_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_courses_learning_outcomes" ADD CONSTRAINT "lms_courses_learning_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lms_courses_tutor_modes" ADD CONSTRAINT "lms_courses_tutor_modes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lms_courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lms_courses" ADD CONSTRAINT "lms_courses_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_modules" ADD CONSTRAINT "lms_modules_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_lessons_attachments" ADD CONSTRAINT "lms_lessons_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_lessons_attachments" ADD CONSTRAINT "lms_lessons_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lms_lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lms_lessons" ADD CONSTRAINT "lms_lessons_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_lessons" ADD CONSTRAINT "lms_lessons_module_id_lms_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."lms_modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_lesson_progress" ADD CONSTRAINT "lms_lesson_progress_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_lesson_progress" ADD CONSTRAINT "lms_lesson_progress_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lms_lesson_progress" ADD CONSTRAINT "lms_lesson_progress_lesson_id_lms_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lms_lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolios_skills" ADD CONSTRAINT "portfolios_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates_skills" ADD CONSTRAINT "certificates_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_issued_by_id_users_id_fk" FOREIGN KEY ("issued_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_reissued_from_id_certificates_id_fk" FOREIGN KEY ("reissued_from_id") REFERENCES "public"."certificates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_revoked_by_id_users_id_fk" FOREIGN KEY ("revoked_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "member_notes" ADD CONSTRAINT "member_notes_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "member_notes" ADD CONSTRAINT "member_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_feedback" ADD CONSTRAINT "ai_feedback_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_knowledge_sources" ADD CONSTRAINT "ai_knowledge_sources_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_knowledge_sources" ADD CONSTRAINT "ai_knowledge_sources_lesson_id_lms_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lms_lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_knowledge_sources" ADD CONSTRAINT "ai_knowledge_sources_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_drafts" ADD CONSTRAINT "ai_drafts_course_id_lms_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_drafts" ADD CONSTRAINT "ai_drafts_lesson_id_lms_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lms_lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_drafts" ADD CONSTRAINT "ai_drafts_parent_draft_id_ai_drafts_id_fk" FOREIGN KEY ("parent_draft_id") REFERENCES "public"."ai_drafts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_drafts" ADD CONSTRAINT "ai_drafts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_career_states" ADD CONSTRAINT "ai_career_states_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_outcomes" ADD CONSTRAINT "courses_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mentors_fk" FOREIGN KEY ("mentors_id") REFERENCES "public"."mentors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mentorship_requests_fk" FOREIGN KEY ("mentorship_requests_id") REFERENCES "public"."mentorship_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mentorship_relationships_fk" FOREIGN KEY ("mentorship_relationships_id") REFERENCES "public"."mentorship_relationships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opportunity_sources_fk" FOREIGN KEY ("opportunity_sources_id") REFERENCES "public"."opportunity_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opportunity_applications_fk" FOREIGN KEY ("opportunity_applications_id") REFERENCES "public"."opportunity_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk" FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_learning_items_fk" FOREIGN KEY ("learning_items_id") REFERENCES "public"."learning_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_progress_fk" FOREIGN KEY ("progress_id") REFERENCES "public"."progress"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lms_courses_fk" FOREIGN KEY ("lms_courses_id") REFERENCES "public"."lms_courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lms_modules_fk" FOREIGN KEY ("lms_modules_id") REFERENCES "public"."lms_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lms_lessons_fk" FOREIGN KEY ("lms_lessons_id") REFERENCES "public"."lms_lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lms_lesson_progress_fk" FOREIGN KEY ("lms_lesson_progress_id") REFERENCES "public"."lms_lesson_progress"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolios_fk" FOREIGN KEY ("portfolios_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_events_fk" FOREIGN KEY ("audit_events_id") REFERENCES "public"."audit_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_member_notes_fk" FOREIGN KEY ("member_notes_id") REFERENCES "public"."member_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_usage_records_fk" FOREIGN KEY ("ai_usage_records_id") REFERENCES "public"."ai_usage_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_feedback_fk" FOREIGN KEY ("ai_feedback_id") REFERENCES "public"."ai_feedback"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_knowledge_sources_fk" FOREIGN KEY ("ai_knowledge_sources_id") REFERENCES "public"."ai_knowledge_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_drafts_fk" FOREIGN KEY ("ai_drafts_id") REFERENCES "public"."ai_drafts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_career_states_fk" FOREIGN KEY ("ai_career_states_id") REFERENCES "public"."ai_career_states"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "members_skills_order_idx" ON "members_skills" USING btree ("_order");
  CREATE INDEX "members_skills_parent_id_idx" ON "members_skills" USING btree ("_parent_id");
  CREATE INDEX "members_career_interests_order_idx" ON "members_career_interests" USING btree ("_order");
  CREATE INDEX "members_career_interests_parent_id_idx" ON "members_career_interests" USING btree ("_parent_id");
  CREATE INDEX "members_roles_order_idx" ON "members_roles" USING btree ("order");
  CREATE INDEX "members_roles_parent_idx" ON "members_roles" USING btree ("parent_id");
  CREATE INDEX "members_sessions_order_idx" ON "members_sessions" USING btree ("_order");
  CREATE INDEX "members_sessions_parent_id_idx" ON "members_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "members_handle_idx" ON "members" USING btree ("handle");
  CREATE INDEX "members_avatar_idx" ON "members" USING btree ("avatar_id");
  CREATE INDEX "members_updated_at_idx" ON "members" USING btree ("updated_at");
  CREATE INDEX "members_created_at_idx" ON "members" USING btree ("created_at");
  CREATE UNIQUE INDEX "members_email_idx" ON "members" USING btree ("email");
  CREATE INDEX "mentors_topics_order_idx" ON "mentors_topics" USING btree ("order");
  CREATE INDEX "mentors_topics_parent_idx" ON "mentors_topics" USING btree ("parent_id");
  CREATE UNIQUE INDEX "mentors_member_idx" ON "mentors" USING btree ("member_id");
  CREATE INDEX "mentors_approved_by_idx" ON "mentors" USING btree ("approved_by_id");
  CREATE INDEX "mentors_updated_at_idx" ON "mentors" USING btree ("updated_at");
  CREATE INDEX "mentors_created_at_idx" ON "mentors" USING btree ("created_at");
  CREATE INDEX "mentorship_requests_requester_idx" ON "mentorship_requests" USING btree ("requester_id");
  CREATE INDEX "mentorship_requests_mentor_idx" ON "mentorship_requests" USING btree ("mentor_id");
  CREATE INDEX "mentorship_requests_updated_at_idx" ON "mentorship_requests" USING btree ("updated_at");
  CREATE INDEX "mentorship_requests_created_at_idx" ON "mentorship_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX "mentorship_relationships_request_idx" ON "mentorship_relationships" USING btree ("request_id");
  CREATE INDEX "mentorship_relationships_mentor_idx" ON "mentorship_relationships" USING btree ("mentor_id");
  CREATE INDEX "mentorship_relationships_mentee_idx" ON "mentorship_relationships" USING btree ("mentee_id");
  CREATE INDEX "mentorship_relationships_updated_at_idx" ON "mentorship_relationships" USING btree ("updated_at");
  CREATE INDEX "mentorship_relationships_created_at_idx" ON "mentorship_relationships" USING btree ("created_at");
  CREATE INDEX "opportunity_sources_updated_at_idx" ON "opportunity_sources" USING btree ("updated_at");
  CREATE INDEX "opportunity_sources_created_at_idx" ON "opportunity_sources" USING btree ("created_at");
  CREATE UNIQUE INDEX "opportunities_slug_idx" ON "opportunities" USING btree ("slug");
  CREATE INDEX "opportunities_source_idx" ON "opportunities" USING btree ("source_id");
  CREATE INDEX "opportunities_external_id_idx" ON "opportunities" USING btree ("external_id");
  CREATE INDEX "opportunities_fingerprint_idx" ON "opportunities" USING btree ("fingerprint");
  CREATE INDEX "opportunities_updated_at_idx" ON "opportunities" USING btree ("updated_at");
  CREATE INDEX "opportunities_created_at_idx" ON "opportunities" USING btree ("created_at");
  CREATE INDEX "opportunity_applications_member_idx" ON "opportunity_applications" USING btree ("member_id");
  CREATE INDEX "opportunity_applications_opportunity_idx" ON "opportunity_applications" USING btree ("opportunity_id");
  CREATE INDEX "opportunity_applications_updated_at_idx" ON "opportunity_applications" USING btree ("updated_at");
  CREATE INDEX "opportunity_applications_created_at_idx" ON "opportunity_applications" USING btree ("created_at");
  CREATE INDEX "enrollments_member_idx" ON "enrollments" USING btree ("member_id");
  CREATE INDEX "enrollments_program_key_idx" ON "enrollments" USING btree ("program_key");
  CREATE INDEX "enrollments_course_idx" ON "enrollments" USING btree ("course_id");
  CREATE INDEX "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");
  CREATE INDEX "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");
  CREATE UNIQUE INDEX "learning_items_slug_idx" ON "learning_items" USING btree ("slug");
  CREATE INDEX "learning_items_program_key_idx" ON "learning_items" USING btree ("program_key");
  CREATE INDEX "learning_items_resource_idx" ON "learning_items" USING btree ("resource_id");
  CREATE INDEX "learning_items_updated_at_idx" ON "learning_items" USING btree ("updated_at");
  CREATE INDEX "learning_items_created_at_idx" ON "learning_items" USING btree ("created_at");
  CREATE INDEX "progress_member_idx" ON "progress" USING btree ("member_id");
  CREATE INDEX "progress_learning_item_idx" ON "progress" USING btree ("learning_item_id");
  CREATE INDEX "progress_enrollment_idx" ON "progress" USING btree ("enrollment_id");
  CREATE INDEX "progress_updated_at_idx" ON "progress" USING btree ("updated_at");
  CREATE INDEX "progress_created_at_idx" ON "progress" USING btree ("created_at");
  CREATE INDEX "lms_courses_learning_outcomes_order_idx" ON "lms_courses_learning_outcomes" USING btree ("_order");
  CREATE INDEX "lms_courses_learning_outcomes_parent_id_idx" ON "lms_courses_learning_outcomes" USING btree ("_parent_id");
  CREATE INDEX "lms_courses_tutor_modes_order_idx" ON "lms_courses_tutor_modes" USING btree ("order");
  CREATE INDEX "lms_courses_tutor_modes_parent_idx" ON "lms_courses_tutor_modes" USING btree ("parent_id");
  CREATE UNIQUE INDEX "lms_courses_slug_idx" ON "lms_courses" USING btree ("slug");
  CREATE INDEX "lms_courses_category_idx" ON "lms_courses" USING btree ("category");
  CREATE INDEX "lms_courses_program_key_idx" ON "lms_courses" USING btree ("program_key");
  CREATE INDEX "lms_courses_cover_idx" ON "lms_courses" USING btree ("cover_id");
  CREATE INDEX "lms_courses_updated_at_idx" ON "lms_courses" USING btree ("updated_at");
  CREATE INDEX "lms_courses_created_at_idx" ON "lms_courses" USING btree ("created_at");
  CREATE INDEX "lms_modules_course_idx" ON "lms_modules" USING btree ("course_id");
  CREATE INDEX "lms_modules_slug_idx" ON "lms_modules" USING btree ("slug");
  CREATE INDEX "lms_modules_updated_at_idx" ON "lms_modules" USING btree ("updated_at");
  CREATE INDEX "lms_modules_created_at_idx" ON "lms_modules" USING btree ("created_at");
  CREATE INDEX "lms_lessons_attachments_order_idx" ON "lms_lessons_attachments" USING btree ("_order");
  CREATE INDEX "lms_lessons_attachments_parent_id_idx" ON "lms_lessons_attachments" USING btree ("_parent_id");
  CREATE INDEX "lms_lessons_attachments_file_idx" ON "lms_lessons_attachments" USING btree ("file_id");
  CREATE INDEX "lms_lessons_course_idx" ON "lms_lessons" USING btree ("course_id");
  CREATE INDEX "lms_lessons_module_idx" ON "lms_lessons" USING btree ("module_id");
  CREATE INDEX "lms_lessons_slug_idx" ON "lms_lessons" USING btree ("slug");
  CREATE INDEX "lms_lessons_updated_at_idx" ON "lms_lessons" USING btree ("updated_at");
  CREATE INDEX "lms_lessons_created_at_idx" ON "lms_lessons" USING btree ("created_at");
  CREATE INDEX "lms_lesson_progress_member_idx" ON "lms_lesson_progress" USING btree ("member_id");
  CREATE INDEX "lms_lesson_progress_course_idx" ON "lms_lesson_progress" USING btree ("course_id");
  CREATE INDEX "lms_lesson_progress_lesson_idx" ON "lms_lesson_progress" USING btree ("lesson_id");
  CREATE INDEX "lms_lesson_progress_updated_at_idx" ON "lms_lesson_progress" USING btree ("updated_at");
  CREATE INDEX "lms_lesson_progress_created_at_idx" ON "lms_lesson_progress" USING btree ("created_at");
  CREATE INDEX "portfolios_skills_order_idx" ON "portfolios_skills" USING btree ("_order");
  CREATE INDEX "portfolios_skills_parent_id_idx" ON "portfolios_skills" USING btree ("_parent_id");
  CREATE INDEX "portfolios_member_idx" ON "portfolios" USING btree ("member_id");
  CREATE UNIQUE INDEX "portfolios_slug_idx" ON "portfolios" USING btree ("slug");
  CREATE INDEX "portfolios_cover_idx" ON "portfolios" USING btree ("cover_id");
  CREATE INDEX "portfolios_updated_at_idx" ON "portfolios" USING btree ("updated_at");
  CREATE INDEX "portfolios_created_at_idx" ON "portfolios" USING btree ("created_at");
  CREATE INDEX "certificates_skills_order_idx" ON "certificates_skills" USING btree ("_order");
  CREATE INDEX "certificates_skills_parent_id_idx" ON "certificates_skills" USING btree ("_parent_id");
  CREATE INDEX "certificates_member_idx" ON "certificates" USING btree ("member_id");
  CREATE INDEX "certificates_program_key_idx" ON "certificates" USING btree ("program_key");
  CREATE INDEX "certificates_course_idx" ON "certificates" USING btree ("course_id");
  CREATE INDEX "certificates_enrollment_idx" ON "certificates" USING btree ("enrollment_id");
  CREATE INDEX "certificates_issued_by_idx" ON "certificates" USING btree ("issued_by_id");
  CREATE UNIQUE INDEX "certificates_active_issuance_key_idx" ON "certificates" USING btree ("active_issuance_key");
  CREATE UNIQUE INDEX "certificates_credential_code_idx" ON "certificates" USING btree ("credential_code");
  CREATE INDEX "certificates_pdf_idx" ON "certificates" USING btree ("pdf_id");
  CREATE INDEX "certificates_reissued_from_idx" ON "certificates" USING btree ("reissued_from_id");
  CREATE INDEX "certificates_revoked_by_idx" ON "certificates" USING btree ("revoked_by_id");
  CREATE INDEX "certificates_updated_at_idx" ON "certificates" USING btree ("updated_at");
  CREATE INDEX "certificates_created_at_idx" ON "certificates" USING btree ("created_at");
  CREATE INDEX "audit_events_actor_idx" ON "audit_events" USING btree ("actor_id");
  CREATE INDEX "audit_events_action_idx" ON "audit_events" USING btree ("action");
  CREATE INDEX "audit_events_entity_type_idx" ON "audit_events" USING btree ("entity_type");
  CREATE INDEX "audit_events_entity_id_idx" ON "audit_events" USING btree ("entity_id");
  CREATE INDEX "audit_events_updated_at_idx" ON "audit_events" USING btree ("updated_at");
  CREATE INDEX "audit_events_created_at_idx" ON "audit_events" USING btree ("created_at");
  CREATE INDEX "member_notes_member_idx" ON "member_notes" USING btree ("member_id");
  CREATE INDEX "member_notes_author_idx" ON "member_notes" USING btree ("author_id");
  CREATE INDEX "member_notes_updated_at_idx" ON "member_notes" USING btree ("updated_at");
  CREATE INDEX "member_notes_created_at_idx" ON "member_notes" USING btree ("created_at");
  CREATE INDEX "ai_usage_records_actor_type_idx" ON "ai_usage_records" USING btree ("actor_type");
  CREATE INDEX "ai_usage_records_actor_key_idx" ON "ai_usage_records" USING btree ("actor_key");
  CREATE INDEX "ai_usage_records_feature_idx" ON "ai_usage_records" USING btree ("feature");
  CREATE INDEX "ai_usage_records_operation_idx" ON "ai_usage_records" USING btree ("operation");
  CREATE INDEX "ai_usage_records_status_idx" ON "ai_usage_records" USING btree ("status");
  CREATE INDEX "ai_usage_records_prompt_hash_idx" ON "ai_usage_records" USING btree ("prompt_hash");
  CREATE INDEX "ai_usage_records_error_code_idx" ON "ai_usage_records" USING btree ("error_code");
  CREATE INDEX "ai_usage_records_expires_at_idx" ON "ai_usage_records" USING btree ("expires_at");
  CREATE INDEX "ai_usage_records_updated_at_idx" ON "ai_usage_records" USING btree ("updated_at");
  CREATE INDEX "ai_usage_records_created_at_idx" ON "ai_usage_records" USING btree ("created_at");
  CREATE INDEX "ai_feedback_member_idx" ON "ai_feedback" USING btree ("member_id");
  CREATE INDEX "ai_feedback_feature_idx" ON "ai_feedback" USING btree ("feature");
  CREATE INDEX "ai_feedback_context_key_idx" ON "ai_feedback" USING btree ("context_key");
  CREATE INDEX "ai_feedback_updated_at_idx" ON "ai_feedback" USING btree ("updated_at");
  CREATE INDEX "ai_feedback_created_at_idx" ON "ai_feedback" USING btree ("created_at");
  CREATE INDEX "ai_knowledge_sources_course_idx" ON "ai_knowledge_sources" USING btree ("course_id");
  CREATE INDEX "ai_knowledge_sources_lesson_idx" ON "ai_knowledge_sources" USING btree ("lesson_id");
  CREATE INDEX "ai_knowledge_sources_kind_idx" ON "ai_knowledge_sources" USING btree ("kind");
  CREATE INDEX "ai_knowledge_sources_approved_idx" ON "ai_knowledge_sources" USING btree ("approved");
  CREATE INDEX "ai_knowledge_sources_reviewed_by_idx" ON "ai_knowledge_sources" USING btree ("reviewed_by_id");
  CREATE INDEX "ai_knowledge_sources_updated_at_idx" ON "ai_knowledge_sources" USING btree ("updated_at");
  CREATE INDEX "ai_knowledge_sources_created_at_idx" ON "ai_knowledge_sources" USING btree ("created_at");
  CREATE INDEX "ai_drafts_course_idx" ON "ai_drafts" USING btree ("course_id");
  CREATE INDEX "ai_drafts_lesson_idx" ON "ai_drafts" USING btree ("lesson_id");
  CREATE INDEX "ai_drafts_kind_idx" ON "ai_drafts" USING btree ("kind");
  CREATE INDEX "ai_drafts_status_idx" ON "ai_drafts" USING btree ("status");
  CREATE INDEX "ai_drafts_parent_draft_idx" ON "ai_drafts" USING btree ("parent_draft_id");
  CREATE INDEX "ai_drafts_created_by_idx" ON "ai_drafts" USING btree ("created_by_id");
  CREATE INDEX "ai_drafts_updated_at_idx" ON "ai_drafts" USING btree ("updated_at");
  CREATE INDEX "ai_drafts_created_at_idx" ON "ai_drafts" USING btree ("created_at");
  CREATE UNIQUE INDEX "ai_career_states_member_idx" ON "ai_career_states" USING btree ("member_id");
  CREATE INDEX "ai_career_states_updated_at_idx" ON "ai_career_states" USING btree ("updated_at");
  CREATE INDEX "ai_career_states_created_at_idx" ON "ai_career_states" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "courses_outcomes_order_idx" ON "courses_outcomes" USING btree ("_order");
  CREATE INDEX "courses_outcomes_parent_id_idx" ON "courses_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX "courses_image_idx" ON "courses" USING btree ("image_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "stories_image_idx" ON "stories" USING btree ("image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_file_idx" ON "resources" USING btree ("file_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_members_id_idx" ON "payload_locked_documents_rels" USING btree ("members_id");
  CREATE INDEX "payload_locked_documents_rels_mentors_id_idx" ON "payload_locked_documents_rels" USING btree ("mentors_id");
  CREATE INDEX "payload_locked_documents_rels_mentorship_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("mentorship_requests_id");
  CREATE INDEX "payload_locked_documents_rels_mentorship_relationships_i_idx" ON "payload_locked_documents_rels" USING btree ("mentorship_relationships_id");
  CREATE INDEX "payload_locked_documents_rels_opportunity_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("opportunity_sources_id");
  CREATE INDEX "payload_locked_documents_rels_opportunities_id_idx" ON "payload_locked_documents_rels" USING btree ("opportunities_id");
  CREATE INDEX "payload_locked_documents_rels_opportunity_applications_i_idx" ON "payload_locked_documents_rels" USING btree ("opportunity_applications_id");
  CREATE INDEX "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");
  CREATE INDEX "payload_locked_documents_rels_learning_items_id_idx" ON "payload_locked_documents_rels" USING btree ("learning_items_id");
  CREATE INDEX "payload_locked_documents_rels_progress_id_idx" ON "payload_locked_documents_rels" USING btree ("progress_id");
  CREATE INDEX "payload_locked_documents_rels_lms_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("lms_courses_id");
  CREATE INDEX "payload_locked_documents_rels_lms_modules_id_idx" ON "payload_locked_documents_rels" USING btree ("lms_modules_id");
  CREATE INDEX "payload_locked_documents_rels_lms_lessons_id_idx" ON "payload_locked_documents_rels" USING btree ("lms_lessons_id");
  CREATE INDEX "payload_locked_documents_rels_lms_lesson_progress_id_idx" ON "payload_locked_documents_rels" USING btree ("lms_lesson_progress_id");
  CREATE INDEX "payload_locked_documents_rels_portfolios_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolios_id");
  CREATE INDEX "payload_locked_documents_rels_certificates_id_idx" ON "payload_locked_documents_rels" USING btree ("certificates_id");
  CREATE INDEX "payload_locked_documents_rels_audit_events_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_events_id");
  CREATE INDEX "payload_locked_documents_rels_member_notes_id_idx" ON "payload_locked_documents_rels" USING btree ("member_notes_id");
  CREATE INDEX "payload_locked_documents_rels_ai_usage_records_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_usage_records_id");
  CREATE INDEX "payload_locked_documents_rels_ai_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_feedback_id");
  CREATE INDEX "payload_locked_documents_rels_ai_knowledge_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_knowledge_sources_id");
  CREATE INDEX "payload_locked_documents_rels_ai_drafts_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_drafts_id");
  CREATE INDEX "payload_locked_documents_rels_ai_career_states_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_career_states_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_members_id_idx" ON "payload_preferences_rels" USING btree ("members_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "members_skills" CASCADE;
  DROP TABLE "members_career_interests" CASCADE;
  DROP TABLE "members_roles" CASCADE;
  DROP TABLE "members_sessions" CASCADE;
  DROP TABLE "members" CASCADE;
  DROP TABLE "mentors_topics" CASCADE;
  DROP TABLE "mentors" CASCADE;
  DROP TABLE "mentorship_requests" CASCADE;
  DROP TABLE "mentorship_relationships" CASCADE;
  DROP TABLE "opportunity_sources" CASCADE;
  DROP TABLE "opportunities" CASCADE;
  DROP TABLE "opportunity_applications" CASCADE;
  DROP TABLE "enrollments" CASCADE;
  DROP TABLE "learning_items" CASCADE;
  DROP TABLE "progress" CASCADE;
  DROP TABLE "lms_courses_learning_outcomes" CASCADE;
  DROP TABLE "lms_courses_tutor_modes" CASCADE;
  DROP TABLE "lms_courses" CASCADE;
  DROP TABLE "lms_modules" CASCADE;
  DROP TABLE "lms_lessons_attachments" CASCADE;
  DROP TABLE "lms_lessons" CASCADE;
  DROP TABLE "lms_lesson_progress" CASCADE;
  DROP TABLE "portfolios_skills" CASCADE;
  DROP TABLE "portfolios" CASCADE;
  DROP TABLE "certificates_skills" CASCADE;
  DROP TABLE "certificates" CASCADE;
  DROP TABLE "audit_events" CASCADE;
  DROP TABLE "member_notes" CASCADE;
  DROP TABLE "ai_usage_records" CASCADE;
  DROP TABLE "ai_feedback" CASCADE;
  DROP TABLE "ai_knowledge_sources" CASCADE;
  DROP TABLE "ai_drafts" CASCADE;
  DROP TABLE "ai_career_states" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "courses_outcomes" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_members_roles";
  DROP TYPE "public"."enum_members_cohort_status";
  DROP TYPE "public"."enum_members_visibility";
  DROP TYPE "public"."enum_mentors_topics";
  DROP TYPE "public"."enum_mentors_seniority";
  DROP TYPE "public"."enum_mentors_availability";
  DROP TYPE "public"."enum_mentors_status";
  DROP TYPE "public"."enum_mentorship_requests_topic";
  DROP TYPE "public"."enum_mentorship_requests_preferred_format";
  DROP TYPE "public"."enum_mentorship_requests_status";
  DROP TYPE "public"."enum_mentorship_relationships_status";
  DROP TYPE "public"."enum_opportunity_sources_type";
  DROP TYPE "public"."enum_opportunities_type";
  DROP TYPE "public"."enum_opportunities_work_mode";
  DROP TYPE "public"."enum_opportunities_experience_level";
  DROP TYPE "public"."enum_opportunities_source_label";
  DROP TYPE "public"."enum_opportunities_status";
  DROP TYPE "public"."enum_opportunity_applications_status";
  DROP TYPE "public"."enum_enrollments_program_type";
  DROP TYPE "public"."enum_enrollments_source";
  DROP TYPE "public"."enum_enrollments_status";
  DROP TYPE "public"."enum_learning_items_kind";
  DROP TYPE "public"."enum_learning_items_access_rule";
  DROP TYPE "public"."enum_learning_items_status";
  DROP TYPE "public"."enum_progress_status";
  DROP TYPE "public"."enum_lms_courses_tutor_modes";
  DROP TYPE "public"."enum_lms_courses_access_rule";
  DROP TYPE "public"."enum_lms_courses_level";
  DROP TYPE "public"."enum_lms_courses_status";
  DROP TYPE "public"."enum_lms_modules_status";
  DROP TYPE "public"."enum_lms_lessons_lesson_type";
  DROP TYPE "public"."enum_lms_lessons_status";
  DROP TYPE "public"."enum_lms_lesson_progress_status";
  DROP TYPE "public"."enum_portfolios_status";
  DROP TYPE "public"."enum_portfolios_visibility";
  DROP TYPE "public"."enum_certificates_notification_status";
  DROP TYPE "public"."enum_certificates_status";
  DROP TYPE "public"."enum_certificates_visibility";
  DROP TYPE "public"."enum_audit_events_visibility";
  DROP TYPE "public"."enum_member_notes_category";
  DROP TYPE "public"."enum_ai_usage_records_actor_type";
  DROP TYPE "public"."enum_ai_usage_records_feature";
  DROP TYPE "public"."enum_ai_usage_records_status";
  DROP TYPE "public"."enum_ai_feedback_feature";
  DROP TYPE "public"."enum_ai_feedback_rating";
  DROP TYPE "public"."enum_ai_feedback_reason";
  DROP TYPE "public"."enum_ai_knowledge_sources_kind";
  DROP TYPE "public"."enum_ai_drafts_kind";
  DROP TYPE "public"."enum_ai_drafts_status";
  DROP TYPE "public"."enum_posts_category";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_resources_type";`)
}
