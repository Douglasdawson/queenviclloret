import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";
import { queryKeys } from "../lib/query";
import type { PublicEvent } from "../lib/types";

/** Reads the SSR-seeded events from the query cache; refetches on the client. */
export function usePublicEvents() {
  return useQuery({
    queryKey: queryKeys.publicEvents,
    queryFn: async () => (await apiGet<{ events: PublicEvent[] }>("/public/events")).events,
    initialData: undefined,
  });
}
