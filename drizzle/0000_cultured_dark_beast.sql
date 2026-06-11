CREATE TYPE "public"."campaign_channel" AS ENUM('email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed');--> statement-breakpoint
CREATE TYPE "public"."commentary_lang" AS ENUM('en', 'es', 'ca', 'ga', 'fr');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'live', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('web_form', 'reservation', 'whatsapp', 'walk_in', 'referral', 'import', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."note_entity_type" AS ENUM('lead', 'reservation', 'event');--> statement-breakpoint
CREATE TYPE "public"."recipient_status" AS ENUM('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'confirmed', 'seated', 'cancelled', 'no_show', 'completed');--> statement-breakpoint
CREATE TYPE "public"."reservation_type" AS ENUM('standard', 'group', 'stag_hen', 'match_day', 'birthday');--> statement-breakpoint
CREATE TYPE "public"."sport_type" AS ENUM('football', 'f1', 'motogp', 'rugby_league', 'gaa', 'boxing', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('owner', 'admin', 'manager', 'staff');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"diff" jsonb,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"channel" "campaign_channel" NOT NULL,
	"status" "recipient_status" DEFAULT 'queued' NOT NULL,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"opened_at" timestamp with time zone,
	"clicked_at" timestamp with time zone,
	"error_message" text,
	"provider_message_id" text,
	"unsubscribe_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"channel" "campaign_channel" NOT NULL,
	"subject" text,
	"preheader" text,
	"body_template" text,
	"body_html" text,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"segment_json" jsonb,
	"stats" jsonb,
	"provider_message_ref" text,
	"ai_generated" boolean DEFAULT false NOT NULL,
	"ai_prompt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "capacity_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"time_slot" time NOT NULL,
	"area_name" text NOT NULL,
	"max_covers" integer NOT NULL,
	"held_covers" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"sport" "sport_type" DEFAULT 'football' NOT NULL,
	"competition" text,
	"home_team" text,
	"away_team" text,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"commentary_lang" "commentary_lang" DEFAULT 'en' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"venue_area" text,
	"external_ref" text,
	"description" text,
	"hero_image_url" text,
	"translations" jsonb,
	"schema_overrides" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "lead_tags" (
	"lead_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "lead_tags_lead_id_tag_id_pk" PRIMARY KEY("lead_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"phone" text,
	"first_name" text,
	"last_name" text,
	"party_size" integer,
	"preferred_lang" "commentary_lang",
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"source" "lead_source" DEFAULT 'web_form' NOT NULL,
	"owner_id" uuid,
	"message" text,
	"last_contacted_at" timestamp with time zone,
	"consent_email" boolean DEFAULT false NOT NULL,
	"consent_whatsapp" boolean DEFAULT false NOT NULL,
	"consent_updated_at" timestamp with time zone,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_term" text,
	"utm_content" text,
	"referrer" text,
	"landing_page" text,
	"sb_data" jsonb,
	"score" smallint DEFAULT 0 NOT NULL,
	"score_updated_at" timestamp with time zone,
	"ai_summary" text,
	"ai_summary_updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "note_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"body" text NOT NULL,
	"author_id" uuid,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"event_id" uuid,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"party_size" integer NOT NULL,
	"reservation_type" "reservation_type" DEFAULT 'standard' NOT NULL,
	"date" date NOT NULL,
	"time_slot" time,
	"duration_min" integer DEFAULT 120 NOT NULL,
	"status" "reservation_status" DEFAULT 'pending' NOT NULL,
	"table_area" text,
	"special_requests" text,
	"confirmed_at" timestamp with time zone,
	"confirmed_by" uuid,
	"cancel_reason" text,
	"source" "lead_source" DEFAULT 'web_form' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#6b7280' NOT NULL,
	"kind" text DEFAULT 'generic' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"failed_login_count" smallint DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid
);
--> statement-breakpoint
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_tags" ADD CONSTRAINT "lead_tags_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_tags" ADD CONSTRAINT "lead_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_confirmed_by_users_id_fk" FOREIGN KEY ("confirmed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_actor_idx" ON "audit_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_log" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "campaign_recipient_uq" ON "campaign_recipients" USING btree ("campaign_id","lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "campaign_recipient_unsub_uq" ON "campaign_recipients" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE INDEX "campaign_recipient_status_idx" ON "campaign_recipients" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaign_recipient_campaign_idx" ON "campaign_recipients" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "campaign_recipient_lead_idx" ON "campaign_recipients" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "campaigns_status_sched_idx" ON "campaigns" USING btree ("status","scheduled_at") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "campaigns_channel_idx" ON "campaigns" USING btree ("channel") WHERE is_deleted = false;--> statement-breakpoint
CREATE UNIQUE INDEX "capacity_slot_uq" ON "capacity_slots" USING btree ("date","time_slot","area_name") WHERE is_deleted = false;--> statement-breakpoint
CREATE UNIQUE INDEX "events_slug_uq" ON "events" USING btree ("slug") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "events_starts_idx" ON "events" USING btree ("starts_at") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "events_status_starts_idx" ON "events" USING btree ("status","starts_at") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "events_sport_idx" ON "events" USING btree ("sport") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "events_featured_idx" ON "events" USING btree ("is_featured") WHERE status = 'published';--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "leads_owner_idx" ON "leads" USING btree ("owner_id") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree (lower("email")) WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "notes_entity_idx" ON "notes" USING btree ("entity_type","entity_id") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "reservations_date_status_idx" ON "reservations" USING btree ("date","status") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "reservations_event_idx" ON "reservations" USING btree ("event_id") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "reservations_lead_idx" ON "reservations" USING btree ("lead_id") WHERE is_deleted = false;--> statement-breakpoint
CREATE INDEX "reservations_email_idx" ON "reservations" USING btree (lower("email")) WHERE is_deleted = false;--> statement-breakpoint
CREATE UNIQUE INDEX "tags_name_uq" ON "tags" USING btree (lower("name")) WHERE is_deleted = false;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq" ON "users" USING btree (lower("email")) WHERE is_deleted = false;