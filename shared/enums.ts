import { pgEnum } from "drizzle-orm/pg-core";

/** Supported content/UI locales. EN is the default. */
export const LOCALES = ["en", "es", "ca", "fr", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const userRole = pgEnum("user_role", ["owner", "admin", "manager", "staff", "editor"]);
export type UserRole = (typeof userRole.enumValues)[number];

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
]);

export const leadSource = pgEnum("lead_source", [
  "web_form",
  "reservation",
  "whatsapp",
  "walk_in",
  "referral",
  "import",
  "other",
]);

export const sportType = pgEnum("sport_type", [
  "football",
  "f1",
  "motogp",
  "rugby_league",
  "gaa",
  "boxing",
  "other",
]);

/** Commentary language for an event/fixture. */
export const commentaryLang = pgEnum("commentary_lang", ["en", "es", "ca", "ga", "fr"]);

export const eventStatus = pgEnum("event_status", [
  "draft",
  "published",
  "live",
  "finished",
  "cancelled",
]);

export const reservationStatus = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "seated",
  "cancelled",
  "no_show",
  "completed",
]);

export const reservationType = pgEnum("reservation_type", [
  "standard",
  "group",
  "stag_hen",
  "match_day",
  "birthday",
]);

export const campaignChannel = pgEnum("campaign_channel", ["email", "whatsapp"]);

export const campaignStatus = pgEnum("campaign_status", [
  "draft",
  "scheduled",
  "sending",
  "sent",
  "paused",
  "failed",
]);

export const recipientStatus = pgEnum("recipient_status", [
  "queued",
  "sent",
  "delivered",
  "opened",
  "clicked",
  "bounced",
  "failed",
  "unsubscribed",
]);

export const noteEntityType = pgEnum("note_entity_type", ["lead", "reservation", "event"]);

export const postStatus = pgEnum("post_status", ["draft", "published", "archived"]);
export type PostStatus = (typeof postStatus.enumValues)[number];
