import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  smallint,
  timestamp,
  date,
  time,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  userRole,
  leadStatus,
  leadSource,
  sportType,
  commentaryLang,
  eventStatus,
  reservationStatus,
  reservationType,
  campaignChannel,
  campaignStatus,
  recipientStatus,
  noteEntityType,
  postStatus,
  type Locale,
} from "./enums";

// Re-export enums so drizzle-kit (which reads this file) registers the pgEnum types.
export * from "./enums";

/**
 * Shared column mixins. `createdBy`/`updatedBy`/`deletedBy` logically reference
 * users.id but are kept FK-free to avoid circular/ordering constraints when
 * spread across every table (including users itself).
 */
const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
};
const auditColumns = {
  createdBy: uuid(),
  updatedBy: uuid(),
};
const softDeleteColumns = {
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ withTimezone: true }),
  deletedBy: uuid(),
};
const base = { ...timestamps, ...auditColumns, ...softDeleteColumns };

const notDeleted = sql`is_deleted = false`;

/* ------------------------------------------------------------------ users */
export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    email: text().notNull(),
    passwordHash: text().notNull(),
    name: text().notNull(),
    role: userRole().notNull().default("staff"),
    isActive: boolean().notNull().default(true),
    lastLoginAt: timestamp({ withTimezone: true }),
    failedLoginCount: smallint().notNull().default(0),
    lockedUntil: timestamp({ withTimezone: true }),
    ...base,
  },
  (t) => [uniqueIndex("users_email_uq").on(sql`lower(${t.email})`).where(notDeleted)],
);

/* ------------------------------------------------------------------ leads */
export const leads = pgTable(
  "leads",
  {
    id: uuid().primaryKey().defaultRandom(),
    email: text(),
    phone: text(), // E.164
    firstName: text(),
    lastName: text(),
    partySize: integer(),
    preferredLang: commentaryLang(),
    status: leadStatus().notNull().default("new"),
    source: leadSource().notNull().default("web_form"),
    ownerId: uuid().references(() => users.id),
    message: text(),
    lastContactedAt: timestamp({ withTimezone: true }),
    // consent (GDPR)
    consentEmail: boolean().notNull().default(false),
    consentWhatsapp: boolean().notNull().default(false),
    consentUpdatedAt: timestamp({ withTimezone: true }),
    // attribution
    utmSource: text(),
    utmMedium: text(),
    utmCampaign: text(),
    utmTerm: text(),
    utmContent: text(),
    referrer: text(),
    landingPage: text(),
    sbData: jsonb(),
    // AI-ready (populated later by the AI layer)
    score: smallint().notNull().default(0),
    scoreUpdatedAt: timestamp({ withTimezone: true }),
    aiSummary: text(),
    aiSummaryUpdatedAt: timestamp({ withTimezone: true }),
    // embedding column reserved for pgvector — enable when AI scoring lands.
    ...base,
  },
  (t) => [
    index("leads_status_idx").on(t.status).where(notDeleted),
    index("leads_owner_idx").on(t.ownerId).where(notDeleted),
    index("leads_created_idx").on(t.createdAt.desc()),
    index("leads_email_idx").on(sql`lower(${t.email})`).where(notDeleted),
  ],
);

/* ------------------------------------------------------------------- tags */
export const tags = pgTable(
  "tags",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    color: text().notNull().default("#6b7280"),
    kind: text().notNull().default("generic"), // lead | event | generic
    ...base,
  },
  (t) => [uniqueIndex("tags_name_uq").on(sql`lower(${t.name})`).where(notDeleted)],
);

export const leadTags = pgTable(
  "lead_tags",
  {
    leadId: uuid()
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    tagId: uuid()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid(),
  },
  (t) => [primaryKey({ columns: [t.leadId, t.tagId] })],
);

/* ------------------------------------------------------------------ notes */
export const notes = pgTable(
  "notes",
  {
    id: uuid().primaryKey().defaultRandom(),
    entityType: noteEntityType().notNull(),
    entityId: uuid().notNull(),
    body: text().notNull(),
    authorId: uuid().references(() => users.id),
    pinned: boolean().notNull().default(false),
    ...base,
  },
  (t) => [index("notes_entity_idx").on(t.entityType, t.entityId).where(notDeleted)],
);

/* ----------------------------------------------------------------- events */
export const events = pgTable(
  "events",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    slug: text().notNull(),
    sport: sportType().notNull().default("football"),
    competition: text(),
    homeTeam: text(),
    awayTeam: text(),
    startsAt: timestamp({ withTimezone: true }).notNull(),
    endsAt: timestamp({ withTimezone: true }),
    // Live result from the fixtures feed (factual, refreshed even on admin-edited rows).
    homeScore: integer(),
    awayScore: integer(),
    scoreStatus: text(), // normalized: "FT" | "HT" | "LIVE" | null (not started)
    commentaryLang: commentaryLang().notNull().default("en"),
    isFeatured: boolean().notNull().default(false),
    status: eventStatus().notNull().default("draft"),
    venueArea: text(),
    externalRef: text(),
    // SEO + i18n
    description: text(),
    heroImageUrl: text(),
    translations: jsonb(), // { en: {title, description}, es: {...}, ca, ga, fr }
    schemaOverrides: jsonb(),
    ...base,
  },
  (t) => [
    uniqueIndex("events_slug_uq").on(t.slug).where(notDeleted),
    index("events_starts_idx").on(t.startsAt).where(notDeleted),
    index("events_status_starts_idx").on(t.status, t.startsAt).where(notDeleted),
    index("events_sport_idx").on(t.sport).where(notDeleted),
    index("events_featured_idx").on(t.isFeatured).where(sql`status = 'published'`),
  ],
);

/* ------------------------------------------------------------- blog posts */
/** Per-locale content for a post / category. Stored in the `translations` jsonb. */
export type PostTranslation = { title: string; excerpt?: string; body: string };
export type PostTranslations = Partial<Record<Locale, PostTranslation>>;
export type CategoryTranslation = { name: string };
export type CategoryTranslations = Partial<Record<Locale, CategoryTranslation>>;

export const postCategories = pgTable(
  "post_categories",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull(),
    translations: jsonb().$type<CategoryTranslations>().notNull(), // { en: {name}, es: {name}, ... }
    sortOrder: integer().notNull().default(0),
    ...base,
  },
  (t) => [uniqueIndex("post_categories_slug_uq").on(t.slug).where(notDeleted)],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull(), // shared across locales; URL is /{locale}/blog/{slug}
    categoryId: uuid()
      .notNull()
      .references(() => postCategories.id),
    status: postStatus().notNull().default("draft"),
    defaultLocale: text().notNull().default("en"), // fallback locale (one of LOCALES)
    isFeatured: boolean().notNull().default(false),
    publishedAt: timestamp({ withTimezone: true }),
    translations: jsonb().$type<PostTranslations>().notNull(), // { en: {title,excerpt,body}, es: {...}, ... }
    authorId: uuid().references(() => users.id),
    schemaOverrides: jsonb(),
    ...base,
  },
  (t) => [
    uniqueIndex("posts_slug_uq").on(t.slug).where(notDeleted),
    index("posts_status_published_idx").on(t.status, t.publishedAt.desc()).where(notDeleted),
    index("posts_category_idx").on(t.categoryId).where(notDeleted),
  ],
);

/* --------------------------------------------------------- capacity slots */
export const capacitySlots = pgTable(
  "capacity_slots",
  {
    id: uuid().primaryKey().defaultRandom(),
    date: date().notNull(),
    timeSlot: time().notNull(),
    areaName: text().notNull(),
    maxCovers: integer().notNull(),
    heldCovers: integer().notNull().default(0),
    ...base,
  },
  (t) => [uniqueIndex("capacity_slot_uq").on(t.date, t.timeSlot, t.areaName).where(notDeleted)],
);

/* ----------------------------------------------------------- reservations */
export const reservations = pgTable(
  "reservations",
  {
    id: uuid().primaryKey().defaultRandom(),
    leadId: uuid().references(() => leads.id),
    eventId: uuid().references(() => events.id),
    name: text().notNull(),
    email: text(),
    phone: text(),
    partySize: integer().notNull(),
    reservationType: reservationType().notNull().default("standard"),
    date: date().notNull(),
    timeSlot: time(),
    durationMin: integer().notNull().default(120),
    status: reservationStatus().notNull().default("pending"),
    tableArea: text(),
    specialRequests: text(),
    confirmedAt: timestamp({ withTimezone: true }),
    confirmedBy: uuid().references(() => users.id),
    cancelReason: text(),
    source: leadSource().notNull().default("web_form"),
    ...base,
  },
  (t) => [
    index("reservations_date_status_idx").on(t.date, t.status).where(notDeleted),
    index("reservations_event_idx").on(t.eventId).where(notDeleted),
    index("reservations_lead_idx").on(t.leadId).where(notDeleted),
    index("reservations_email_idx").on(sql`lower(${t.email})`).where(notDeleted),
  ],
);

/* -------------------------------------------------------------- campaigns */
export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    channel: campaignChannel().notNull(),
    subject: text(),
    preheader: text(),
    bodyTemplate: text(),
    bodyHtml: text(),
    status: campaignStatus().notNull().default("draft"),
    scheduledAt: timestamp({ withTimezone: true }),
    sentAt: timestamp({ withTimezone: true }),
    segmentJson: jsonb(), // lead filter: status/tags/consent/lang
    stats: jsonb(),
    providerMessageRef: text(),
    // AI-ready
    aiGenerated: boolean().notNull().default(false),
    aiPrompt: text(),
    ...base,
  },
  (t) => [
    index("campaigns_status_sched_idx").on(t.status, t.scheduledAt).where(notDeleted),
    index("campaigns_channel_idx").on(t.channel).where(notDeleted),
  ],
);

/* --------------------------------------------------- campaign_recipients */
export const campaignRecipients = pgTable(
  "campaign_recipients",
  {
    id: uuid().primaryKey().defaultRandom(),
    campaignId: uuid()
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    leadId: uuid()
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    channel: campaignChannel().notNull(),
    status: recipientStatus().notNull().default("queued"),
    sentAt: timestamp({ withTimezone: true }),
    deliveredAt: timestamp({ withTimezone: true }),
    openedAt: timestamp({ withTimezone: true }),
    clickedAt: timestamp({ withTimezone: true }),
    errorMessage: text(),
    providerMessageId: text(),
    unsubscribeToken: text().notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("campaign_recipient_uq").on(t.campaignId, t.leadId),
    uniqueIndex("campaign_recipient_unsub_uq").on(t.unsubscribeToken),
    index("campaign_recipient_status_idx").on(t.status),
    index("campaign_recipient_campaign_idx").on(t.campaignId),
    index("campaign_recipient_lead_idx").on(t.leadId),
  ],
);

/* ------------------------------------------------------------- audit_log */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid().primaryKey().defaultRandom(),
    actorId: uuid(),
    action: text().notNull(),
    entityType: text().notNull(),
    entityId: uuid(),
    diff: jsonb(),
    ip: text(),
    userAgent: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("audit_entity_idx").on(t.entityType, t.entityId),
    index("audit_actor_idx").on(t.actorId),
    index("audit_created_idx").on(t.createdAt.desc()),
  ],
);

/* ------------------------------------------------------------- relations */
export const usersRelations = relations(users, ({ many }) => ({
  ownedLeads: many(leads),
  notes: many(notes),
  campaigns: many(campaigns),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  owner: one(users, { fields: [leads.ownerId], references: [users.id] }),
  leadTags: many(leadTags),
  reservations: many(reservations),
  recipients: many(campaignRecipients),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  leadTags: many(leadTags),
}));

export const leadTagsRelations = relations(leadTags, ({ one }) => ({
  lead: one(leads, { fields: [leadTags.leadId], references: [leads.id] }),
  tag: one(tags, { fields: [leadTags.tagId], references: [tags.id] }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  lead: one(leads, { fields: [reservations.leadId], references: [leads.id] }),
  event: one(events, { fields: [reservations.eventId], references: [events.id] }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  recipients: many(campaignRecipients),
}));

export const postCategoriesRelations = relations(postCategories, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  category: one(postCategories, { fields: [posts.categoryId], references: [postCategories.id] }),
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));

export const campaignRecipientsRelations = relations(campaignRecipients, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignRecipients.campaignId],
    references: [campaigns.id],
  }),
  lead: one(leads, { fields: [campaignRecipients.leadId], references: [leads.id] }),
}));

/* ----------------------------------------------------------------- types */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type CapacitySlot = typeof capacitySlots.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type CampaignRecipient = typeof campaignRecipients.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostCategory = typeof postCategories.$inferSelect;
export type NewPostCategory = typeof postCategories.$inferInsert;
