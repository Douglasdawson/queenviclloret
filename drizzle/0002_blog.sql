-- Blog feature: post_categories + posts, post_status enum, 'editor' user role.
-- ⚠️ Apply MANUALLY on Neon (psql or Replit DB shell). DO NOT use `db:push`
--    in this project — it tries to DROP the session table.
-- Additive only (new types/tables/indexes); no drops, safe to re-run.
-- Run with autocommit (plain psql, no -1): ALTER TYPE ... ADD VALUE cannot share
-- a transaction with statements that then use the new value.

-- 1. Enums ------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'editor';

-- 2. Tables -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "post_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"translations" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"category_id" uuid NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"default_locale" text DEFAULT 'en' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"translations" jsonb NOT NULL,
	"author_id" uuid,
	"schema_overrides" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);

-- 3. Foreign keys -----------------------------------------------------------
DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk"
    FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id")
    ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk"
    FOREIGN KEY ("author_id") REFERENCES "public"."users"("id")
    ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 4. Indexes ----------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS "post_categories_slug_uq" ON "post_categories" USING btree ("slug") WHERE is_deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_uq" ON "posts" USING btree ("slug") WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS "posts_status_published_idx" ON "posts" USING btree ("status","published_at" DESC NULLS LAST) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS "posts_category_idx" ON "posts" USING btree ("category_id") WHERE is_deleted = false;
