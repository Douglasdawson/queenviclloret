import { and, desc, eq, ne, sql, isNotNull, lte } from "drizzle-orm";
import { db } from "../db";
import { posts, type Post, type PostTranslations } from "@shared/schema";
import type { Locale } from "@shared/enums";
import type { AuditContext } from "../middlewares/audit-context";
import { cacheInvalidate } from "../cache";
import { slugify } from "../lib/slug";
import { pageParams, softDelete, withCreate, withUpdate, writeAudit, type PageParams } from "./base.dao";

interface UpsertPost {
  slug?: string;
  categoryId: string;
  status?: Post["status"];
  defaultLocale?: string;
  isFeatured?: boolean;
  featuredImageUrl?: string | null;
  scheduledAt?: Date | null;
  translations: PostTranslations;
}

export interface ListPostsFilter extends PageParams {
  status?: Post["status"];
  categoryId?: string;
}

function invalidate() {
  cacheInvalidate("ssr:");
  cacheInvalidate("api:public:");
}

/** Admin list (all statuses), newest first. */
export async function listPosts(filter: ListPostsFilter) {
  const { limit, offset } = pageParams(filter);
  const conds = [eq(posts.isDeleted, false)];
  if (filter.status) conds.push(eq(posts.status, filter.status));
  if (filter.categoryId) conds.push(eq(posts.categoryId, filter.categoryId));
  const where = and(...conds);
  const [rows, [{ count }]] = await Promise.all([
    db.select().from(posts).where(where).orderBy(desc(posts.updatedAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(posts).where(where),
  ]);
  return { rows, total: count, limit, offset };
}

/** Published posts for the public site (optionally filtered by category). */
export async function listPublicPosts(opts: { categoryId?: string; limit?: number } = {}): Promise<Post[]> {
  const conds = [eq(posts.isDeleted, false), eq(posts.status, "published")];
  if (opts.categoryId) conds.push(eq(posts.categoryId, opts.categoryId));
  return db
    .select()
    .from(posts)
    .where(and(...conds))
    .orderBy(desc(posts.publishedAt))
    .limit(opts.limit ?? 50);
}

/** Other published posts in the same category (for the "read next" block). */
export async function listRelatedPosts(
  categoryId: string,
  excludeId: string,
  limit = 3,
): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.isDeleted, false),
        eq(posts.status, "published"),
        eq(posts.categoryId, categoryId),
        ne(posts.id, excludeId),
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

/** Draft posts whose scheduled publish time has passed (used by the cron). */
export async function listDueScheduledPosts(now: Date): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.isDeleted, false),
        eq(posts.status, "draft"),
        isNotNull(posts.scheduledAt),
        lte(posts.scheduledAt, now),
      ),
    )
    .limit(50);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.isDeleted, false)))
    .limit(1);
  return rows[0];
}

export async function getPublicPostBySlug(slug: string): Promise<Post | undefined> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.isDeleted, false), eq(posts.status, "published")))
    .limit(1);
  return rows[0];
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || "post";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.isDeleted, false)))
      .limit(1);
    if (!rows[0] || rows[0].id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createPost(input: UpsertPost, ctx: AuditContext): Promise<Post> {
  const locale = (input.defaultLocale ?? "en") as Locale;
  const titleSeed = input.slug ?? input.translations[locale]?.title ?? "post";
  const slug = await uniqueSlug(slugify(titleSeed));
  const status = input.status ?? "draft";
  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .insert(posts)
      .values(
        withCreate(
          {
            slug,
            categoryId: input.categoryId,
            status,
            defaultLocale: locale,
            isFeatured: input.isFeatured ?? false,
            featuredImageUrl: input.featuredImageUrl || null,
            scheduledAt: input.scheduledAt ?? null,
            translations: input.translations,
            authorId: ctx.actorId,
            publishedAt: status === "published" ? new Date() : null,
          },
          ctx.actorId,
        ),
      )
      .returning();
    await writeAudit(tx, ctx, { action: "post.create", entityType: "post", entityId: r.id });
    return r;
  });
  invalidate();
  return row;
}

export async function updatePost(
  id: string,
  patch: Partial<UpsertPost>,
  ctx: AuditContext,
): Promise<Post | undefined> {
  const current = await getPostById(id);
  if (!current) return undefined;

  const set: Record<string, unknown> = {};
  if (patch.translations) set.translations = patch.translations;
  if (patch.categoryId) set.categoryId = patch.categoryId;
  if (patch.defaultLocale) set.defaultLocale = patch.defaultLocale;
  if (patch.isFeatured !== undefined) set.isFeatured = patch.isFeatured;
  if (patch.featuredImageUrl !== undefined) set.featuredImageUrl = patch.featuredImageUrl || null;
  if (patch.scheduledAt !== undefined) set.scheduledAt = patch.scheduledAt;
  if (patch.slug) set.slug = await uniqueSlug(slugify(patch.slug), id);
  if (patch.status) {
    set.status = patch.status;
    // Stamp publishedAt the first time a post goes live.
    if (patch.status === "published" && !current.publishedAt) set.publishedAt = new Date();
  }

  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .update(posts)
      .set(withUpdate(set, ctx.actorId))
      .where(and(eq(posts.id, id), eq(posts.isDeleted, false)))
      .returning();
    if (r)
      await writeAudit(tx, ctx, {
        action: "post.update",
        entityType: "post",
        entityId: id,
        diff: patch,
      });
    return r;
  });
  invalidate();
  return row;
}

export async function setPostStatus(id: string, status: Post["status"], ctx: AuditContext) {
  return updatePost(id, { status }, ctx);
}

export async function removePost(id: string, ctx: AuditContext): Promise<boolean> {
  const ok = await db.transaction(async (tx) => {
    const done = await softDelete(tx, posts, id, ctx.actorId);
    if (done) await writeAudit(tx, ctx, { action: "post.delete", entityType: "post", entityId: id });
    return done;
  });
  invalidate();
  return ok;
}
