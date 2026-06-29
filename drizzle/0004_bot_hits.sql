-- AI / answer-engine + search-crawler hit telemetry. Append-only log (no soft
-- delete, no audit columns — like audit_log), pruned by the daily cleanup cron.
-- Idempotent: safe to re-run on every boot via ensure-schema.
CREATE TABLE IF NOT EXISTS "bot_hits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "bot_name" text NOT NULL,
  "category" text NOT NULL,
  "path" text NOT NULL,
  "status_code" smallint,
  "ip" text,
  "user_agent" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "bot_hits_bot_created_idx" ON "bot_hits" ("bot_name", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "bot_hits_created_idx" ON "bot_hits" ("created_at" DESC);
