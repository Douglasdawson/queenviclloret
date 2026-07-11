import { and, asc, desc, eq, gte, ilike, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import { events, type Event, type NewEvent } from "@shared/schema";
import type { AuditContext } from "../middlewares/audit-context";
import { cacheInvalidate } from "../cache";
import { slugify } from "../lib/slug";
import { pageParams, softDelete, withCreate, withUpdate, writeAudit, type PageParams } from "./base.dao";

const PUBLIC_KEY = "ssr:"; // SSR/page cache prefix to invalidate on change

export interface ListEventsFilter extends PageParams {
  status?: Event["status"];
  sport?: Event["sport"];
  upcoming?: boolean;
}

export async function listEvents(filter: ListEventsFilter) {
  const { limit, offset } = pageParams(filter);
  const conds = [eq(events.isDeleted, false)];
  if (filter.status) conds.push(eq(events.status, filter.status));
  if (filter.sport) conds.push(eq(events.sport, filter.sport));
  if (filter.upcoming) conds.push(gte(events.startsAt, new Date()));
  const where = and(...conds);
  const [rows, [{ count }]] = await Promise.all([
    db.select().from(events).where(where).orderBy(asc(events.startsAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(events).where(where),
  ]);
  return { rows, total: count, limit, offset };
}

/**
 * Owner rule (2026-07-11): never advertise fixtures kicking off before 20:00
 * local time. Late-night kick-offs (00:00–02:59, e.g. World Cup games played in
 * the Americas) still fall inside opening hours (19:00–03:00) and stay visible.
 * Applies to every public surface (API, SSR, sitemap, llms.txt); admin sees all.
 */
const madridHour = sql<number>`extract(hour from ${events.startsAt} at time zone 'Europe/Madrid')`;
const advertisableHours = sql`(${madridHour} >= 20 or ${madridHour} < 3)`;

/** Published & upcoming events for the public site (cached at route level). */
export async function listPublicUpcoming(limitN = 50): Promise<Event[]> {
  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.isDeleted, false),
        inArray(events.status, ["published", "live"]),
        gte(events.startsAt, new Date(Date.now() - 6 * 3600_000)),
        advertisableHours,
      ),
    )
    .orderBy(asc(events.startsAt))
    .limit(limitN);
}

/**
 * World Cup schedule + results for the public page: published/live/finished
 * matches in the FIFA World Cup, chronological. Includes scores so already-played
 * games render their result. (Filter by competition string the feed sets for
 * league 4429 — verify it matches "%World Cup%" after the first sync.)
 */
export async function listWorldCup(limitN = 130): Promise<Event[]> {
  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.isDeleted, false),
        inArray(events.status, ["published", "live", "finished"]),
        ilike(events.competition, "%World Cup%"),
        advertisableHours,
      ),
    )
    .orderBy(asc(events.startsAt))
    .limit(limitN);
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const rows = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), eq(events.isDeleted, false)))
    .limit(1);
  return rows[0];
}

export async function getPublicEventBySlug(slug: string): Promise<Event | undefined> {
  const rows = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.slug, slug),
        eq(events.isDeleted, false),
        inArray(events.status, ["published", "live", "finished"]),
        advertisableHours,
      ),
    )
    .limit(1);
  return rows[0];
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || "event";
  let n = 1;
  // simple collision avoidance
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await db
      .select({ id: events.id })
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.isDeleted, false)))
      .limit(1);
    if (!rows[0] || rows[0].id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createEvent(input: NewEvent, ctx: AuditContext): Promise<Event> {
  const slug = await uniqueSlug(input.slug ? slugify(input.slug) : slugify(input.title));
  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .insert(events)
      .values(withCreate({ ...input, slug }, ctx.actorId) as NewEvent)
      .returning();
    await writeAudit(tx, ctx, { action: "event.create", entityType: "event", entityId: r.id });
    return r;
  });
  cacheInvalidate(PUBLIC_KEY);
  return row;
}

export async function updateEvent(
  id: string,
  patch: Partial<NewEvent>,
  ctx: AuditContext,
): Promise<Event | undefined> {
  if (patch.slug) patch.slug = await uniqueSlug(slugify(patch.slug), id);
  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .update(events)
      .set(withUpdate(patch, ctx.actorId))
      .where(and(eq(events.id, id), eq(events.isDeleted, false)))
      .returning();
    if (r)
      await writeAudit(tx, ctx, {
        action: "event.update",
        entityType: "event",
        entityId: id,
        diff: patch,
      });
    return r;
  });
  cacheInvalidate(PUBLIC_KEY);
  return row;
}

export async function setEventStatus(id: string, status: Event["status"], ctx: AuditContext) {
  return updateEvent(id, { status }, ctx);
}

export async function setEventFeatured(id: string, isFeatured: boolean, ctx: AuditContext) {
  return updateEvent(id, { isFeatured }, ctx);
}

/**
 * Idempotent import from a fixtures feed, keyed by externalRef.
 * - New fixture → insert (draft, or published when autoPublish).
 * - Existing machine-managed fixture → refresh time/teams/title.
 * - Admin-edited fixtures (updatedBy set) are never overwritten.
 * Returns "inserted" | "updated" | "skipped".
 */
export async function upsertFromFeed(
  f: {
    externalRef: string;
    title: string;
    sport: Event["sport"];
    competition: string;
    homeTeam: string | null;
    awayTeam: string | null;
    startsAt: Date;
    homeScore?: number | null;
    awayScore?: number | null;
    scoreStatus?: string | null;
  },
  autoPublish: boolean,
): Promise<"inserted" | "updated" | "skipped"> {
  const homeScore = f.homeScore ?? null;
  const awayScore = f.awayScore ?? null;
  const scoreStatus = f.scoreStatus ?? null;

  const existing = await db
    .select()
    .from(events)
    .where(and(eq(events.externalRef, f.externalRef), eq(events.isDeleted, false)))
    .limit(1);

  if (!existing[0]) {
    const slug = await uniqueSlug(slugify(f.title));
    await db.insert(events).values({
      externalRef: f.externalRef,
      title: f.title,
      slug,
      sport: f.sport,
      competition: f.competition,
      homeTeam: f.homeTeam,
      awayTeam: f.awayTeam,
      startsAt: f.startsAt,
      homeScore,
      awayScore,
      scoreStatus,
      commentaryLang: "en",
      status: autoPublish ? "published" : "draft",
    });
    cacheInvalidate(PUBLIC_KEY);
    return "inserted";
  }

  const row = existing[0];
  const patch: Partial<NewEvent> = {};

  // Scores are factual — refresh them even on admin-edited rows.
  if (row.homeScore !== homeScore) patch.homeScore = homeScore;
  if (row.awayScore !== awayScore) patch.awayScore = awayScore;
  if (row.scoreStatus !== scoreStatus) patch.scoreStatus = scoreStatus;

  // Editorial fields: only the machine-managed rows (no admin touch) follow the feed.
  if (!row.updatedBy) {
    if (row.title !== f.title) patch.title = f.title;
    if (row.homeTeam !== f.homeTeam) patch.homeTeam = f.homeTeam;
    if (row.awayTeam !== f.awayTeam) patch.awayTeam = f.awayTeam;
    if (row.startsAt.getTime() !== f.startsAt.getTime()) patch.startsAt = f.startsAt;
  }

  if (Object.keys(patch).length === 0) return "skipped";

  await db
    .update(events)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(events.id, row.id));
  cacheInvalidate(PUBLIC_KEY);
  return "updated";
}

export async function removeEvent(id: string, ctx: AuditContext): Promise<boolean> {
  const ok = await db.transaction(async (tx) => {
    const done = await softDelete(tx, events, id, ctx.actorId);
    if (done)
      await writeAudit(tx, ctx, { action: "event.delete", entityType: "event", entityId: id });
    return done;
  });
  cacheInvalidate(PUBLIC_KEY);
  return ok;
}
