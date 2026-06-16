import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";
import { queryKeys } from "../lib/query";
import type { PublicEvent } from "../lib/types";

/**
 * World Cup schedule + live results. SSR-seeded, then polled near-live so scores
 * update without a reload (refetchInterval + refetch on window focus).
 */
export function useWorldCupEvents() {
  return useQuery({
    queryKey: queryKeys.worldCup,
    queryFn: async () => (await apiGet<{ events: PublicEvent[] }>("/public/world-cup")).events,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    initialData: undefined,
  });
}
