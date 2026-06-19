import type { Post, PostCategory } from "@shared/schema";
import { renderMarkdown } from "./markdown";

type RawTr = { title: string; excerpt?: string; body: string };

export interface PublicPostListItem {
  slug: string;
  categoryId: string;
  isFeatured: boolean;
  publishedAt: string | null;
  defaultLocale: string;
  locales: string[]; // locales that have a translation (drives hreflang)
  translations: Record<string, { title: string; excerpt?: string }>;
}

export interface PublicPostDetail extends PublicPostListItem {
  updatedAt: string | null;
  bodyHtml: Record<string, string>; // per-locale sanitized HTML
}

function rawTranslations(p: Post): Record<string, RawTr> {
  return (p.translations ?? {}) as Record<string, RawTr>;
}

export function toPublicListItem(p: Post): PublicPostListItem {
  const t = rawTranslations(p);
  const locales = Object.keys(t);
  const translations: Record<string, { title: string; excerpt?: string }> = {};
  for (const loc of locales) translations[loc] = { title: t[loc].title, excerpt: t[loc].excerpt };
  return {
    slug: p.slug,
    categoryId: p.categoryId,
    isFeatured: p.isFeatured,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    defaultLocale: p.defaultLocale,
    locales,
    translations,
  };
}

export function toPublicDetail(p: Post): PublicPostDetail {
  const base = toPublicListItem(p);
  const t = rawTranslations(p);
  const bodyHtml: Record<string, string> = {};
  for (const loc of base.locales) bodyHtml[loc] = renderMarkdown(t[loc].body);
  return { ...base, updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null, bodyHtml };
}

export function toPublicCategory(c: PostCategory) {
  return { id: c.id, slug: c.slug, sortOrder: c.sortOrder, translations: c.translations };
}
export type PublicCategory = ReturnType<typeof toPublicCategory>;
