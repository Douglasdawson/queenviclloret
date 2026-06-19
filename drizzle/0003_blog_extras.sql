-- Blog extras: per-post featured image URL + scheduled publish time.
-- ⚠️ Apply MANUALLY on Neon (psql -f). Never `db:push` here (drops session).
-- Additive only; safe to re-run.

ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "featured_image_url" text;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "scheduled_at" timestamp with time zone;

-- Cron picks up draft posts whose scheduled_at has passed.
CREATE INDEX IF NOT EXISTS "posts_scheduled_idx" ON "posts" USING btree ("scheduled_at")
  WHERE is_deleted = false AND status = 'draft';
