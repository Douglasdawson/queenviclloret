import { sql, gte, desc } from "drizzle-orm";
import { db } from "../db";
import { botHits } from "@shared/schema";
import type { BotCategory } from "@shared/bots";

/** Record a single crawler hit. Fire-and-forget — never on the request path. */
export async function recordHit(v: {
  botName: string;
  category: BotCategory;
  path: string;
  statusCode?: number | null;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  await db.insert(botHits).values({
    botName: v.botName,
    category: v.category,
    path: v.path,
    statusCode: v.statusCode ?? null,
    ip: v.ip ?? null,
    userAgent: v.userAgent ?? null,
  });
}

function since(days: number): Date {
  return new Date(Date.now() - days * 86_400_000);
}

const hits = sql<number>`count(*)::int`;

export interface BotSummaryRow {
  botName: string;
  category: string;
  hits: number;
  lastSeen: string;
}

/** Per-bot totals over the window, busiest first. */
export function byBot(days: number): Promise<BotSummaryRow[]> {
  return db
    .select({
      botName: botHits.botName,
      category: botHits.category,
      hits,
      lastSeen: sql<string>`max(${botHits.createdAt})`,
    })
    .from(botHits)
    .where(gte(botHits.createdAt, since(days)))
    .groupBy(botHits.botName, botHits.category)
    .orderBy(desc(hits));
}

/** Per-category totals over the window. */
export function byCategory(days: number): Promise<{ category: string; hits: number }[]> {
  return db
    .select({ category: botHits.category, hits })
    .from(botHits)
    .where(gte(botHits.createdAt, since(days)))
    .groupBy(botHits.category)
    .orderBy(desc(hits));
}

/** Daily counts per category for the trend chart. */
export function dailyTrend(
  days: number,
): Promise<{ day: string; category: string; hits: number }[]> {
  return db
    .select({
      day: sql<string>`(${botHits.createdAt} at time zone 'UTC')::date`,
      category: botHits.category,
      hits,
    })
    .from(botHits)
    .where(gte(botHits.createdAt, since(days)))
    .groupBy(sql`1`, botHits.category)
    .orderBy(sql`1`);
}

/** Most-crawled paths over the window. */
export function topPaths(days: number, limit = 15): Promise<{ path: string; hits: number }[]> {
  return db
    .select({ path: botHits.path, hits })
    .from(botHits)
    .where(gte(botHits.createdAt, since(days)))
    .groupBy(botHits.path)
    .orderBy(desc(hits))
    .limit(limit);
}

/** The latest individual hits, for a live feed. */
export function recent(
  limit = 50,
): Promise<{ botName: string; category: string; path: string; statusCode: number | null; createdAt: Date }[]> {
  return db
    .select({
      botName: botHits.botName,
      category: botHits.category,
      path: botHits.path,
      statusCode: botHits.statusCode,
      createdAt: botHits.createdAt,
    })
    .from(botHits)
    .orderBy(desc(botHits.createdAt))
    .limit(limit);
}

/** Delete rows older than `days`. Returns the number pruned. */
export async function pruneOlderThan(days: number): Promise<number> {
  const res = await db.delete(botHits).where(sql`${botHits.createdAt} < ${since(days)}`);
  return res.rowCount ?? 0;
}
