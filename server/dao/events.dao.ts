import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
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
