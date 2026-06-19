import { and, asc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  postCategories,
  type CategoryTranslations,
  type PostCategory,
} from "@shared/schema";
import type { AuditContext } from "../middlewares/audit-context";
import { cacheInvalidate } from "../cache";
import { slugify } from "../lib/slug";
import { softDelete, withCreate, withUpdate, writeAudit } from "./base.dao";

interface UpsertCategory {
  slug?: string;
  sortOrder?: number;
  translations: CategoryTranslations;
}

function invalidate() {
  cacheInvalidate("ssr:");
  cacheInvalidate("api:public:");
}

function seedName(t: CategoryTranslations): string {
  return t.en?.name ?? Object.values(t)[0]?.name ?? "category";
}

export async function listCategories(): Promise<PostCategory[]> {
  return db
    .select()
    .from(postCategories)
    .where(eq(postCategories.isDeleted, false))
    .orderBy(asc(postCategories.sortOrder));
}

export async function getCategoryById(id: string): Promise<PostCategory | undefined> {
  const rows = await db
    .select()
    .from(postCategories)
    .where(and(eq(postCategories.id, id), eq(postCategories.isDeleted, false)))
    .limit(1);
  return rows[0];
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || "category";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await db
      .select({ id: postCategories.id })
      .from(postCategories)
      .where(and(eq(postCategories.slug, slug), eq(postCategories.isDeleted, false)))
      .limit(1);
    if (!rows[0] || rows[0].id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createCategory(input: UpsertCategory, ctx: AuditContext): Promise<PostCategory> {
  const slug = await uniqueSlug(slugify(input.slug ?? seedName(input.translations)));
  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .insert(postCategories)
      .values(
        withCreate(
          { slug, translations: input.translations, sortOrder: input.sortOrder ?? 0 },
          ctx.actorId,
        ),
      )
      .returning();
    await writeAudit(tx, ctx, {
      action: "post_category.create",
      entityType: "post_category",
      entityId: r.id,
    });
    return r;
  });
  invalidate();
  return row;
}

export async function updateCategory(
  id: string,
  patch: Partial<UpsertCategory>,
  ctx: AuditContext,
): Promise<PostCategory | undefined> {
  const set: Record<string, unknown> = {};
  if (patch.translations) set.translations = patch.translations;
  if (patch.sortOrder !== undefined) set.sortOrder = patch.sortOrder;
  if (patch.slug) set.slug = await uniqueSlug(slugify(patch.slug), id);
  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .update(postCategories)
      .set(withUpdate(set, ctx.actorId))
      .where(and(eq(postCategories.id, id), eq(postCategories.isDeleted, false)))
      .returning();
    if (r)
      await writeAudit(tx, ctx, {
        action: "post_category.update",
        entityType: "post_category",
        entityId: id,
        diff: patch,
      });
    return r;
  });
  invalidate();
  return row;
}

export async function removeCategory(id: string, ctx: AuditContext): Promise<boolean> {
  const ok = await db.transaction(async (tx) => {
    const done = await softDelete(tx, postCategories, id, ctx.actorId);
    if (done)
      await writeAudit(tx, ctx, {
        action: "post_category.delete",
        entityType: "post_category",
        entityId: id,
      });
    return done;
  });
  invalidate();
  return ok;
}
