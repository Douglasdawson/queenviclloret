import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";
import { queryKeys } from "../lib/query";

export interface PublicPostListItem {
  slug: string;
  categoryId: string;
  isFeatured: boolean;
  publishedAt: string | null;
  defaultLocale: string;
  locales: string[];
  translations: Record<string, { title: string; excerpt?: string }>;
}

export interface PublicPostDetail extends PublicPostListItem {
  updatedAt: string | null;
  bodyHtml: Record<string, string>;
}

export interface PublicCategory {
  id: string;
  slug: string;
  sortOrder: number;
  translations: Record<string, { name: string }>;
}

/** Pick the best translation for the active locale, falling back gracefully. */
export function pickTr<T>(
  tr: Record<string, T> | undefined,
  locale: string,
  defaultLocale?: string,
): T | undefined {
  if (!tr) return undefined;
  return tr[locale] ?? (defaultLocale ? tr[defaultLocale] : undefined) ?? Object.values(tr)[0];
}

export function usePublicPosts(category?: string) {
  return useQuery({
    queryKey: queryKeys.publicPosts(category),
    queryFn: async () =>
      (
        await apiGet<{ posts: PublicPostListItem[] }>(
          `/public/posts${category ? `?category=${encodeURIComponent(category)}` : ""}`,
        )
      ).posts,
  });
}

export function usePostCategories() {
  return useQuery({
    queryKey: queryKeys.postCategories,
    queryFn: async () =>
      (await apiGet<{ categories: PublicCategory[] }>("/public/post-categories")).categories,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: async () => (await apiGet<{ post: PublicPostDetail }>(`/public/posts/${slug}`)).post,
    enabled: !!slug,
  });
}
