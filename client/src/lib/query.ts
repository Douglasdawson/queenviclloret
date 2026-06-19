import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export const queryKeys = {
  publicEvents: ["public", "events"] as const,
  worldCup: ["public", "world-cup"] as const,
  publicPosts: (category?: string) => ["public", "posts", category ?? "all"] as const,
  postCategories: ["public", "post-categories"] as const,
  post: (slug: string) => ["public", "post", slug] as const,
  me: ["auth", "me"] as const,
  leads: (filter?: unknown) => ["leads", filter] as const,
  events: (filter?: unknown) => ["events", filter] as const,
  reservations: (filter?: unknown) => ["reservations", filter] as const,
};
