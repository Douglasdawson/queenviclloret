import type { PublicEvent } from "./types";
import { teamSlug, INDEXABLE_TEAMS, isIndexableTeam } from "@shared/wc-slug";

export { teamSlug, INDEXABLE_TEAMS, isIndexableTeam };

export interface WcTeam {
  name: string;
  slug: string;
}

/** Distinct teams present in the fixture data, in first-seen order. */
export function teamsFromEvents(events: PublicEvent[]): WcTeam[] {
  const seen = new Map<string, WcTeam>();
  for (const e of events) {
    for (const name of [e.homeTeam, e.awayTeam]) {
      if (!name) continue;
      const slug = teamSlug(name);
      if (!seen.has(slug)) seen.set(slug, { name, slug });
    }
  }
  return [...seen.values()];
}

/** Resolve a team slug back to its display name from the fixture data. */
export function teamFromSlug(events: PublicEvent[], slug: string): string | undefined {
  for (const e of events) {
    if (e.homeTeam && teamSlug(e.homeTeam) === slug) return e.homeTeam;
    if (e.awayTeam && teamSlug(e.awayTeam) === slug) return e.awayTeam;
  }
  return undefined;
}

/** Fixtures involving a given team slug, in chronological (data) order. */
export function fixturesForTeam(events: PublicEvent[], slug: string): PublicEvent[] {
  return events.filter(
    (e) =>
      (e.homeTeam && teamSlug(e.homeTeam) === slug) ||
      (e.awayTeam && teamSlug(e.awayTeam) === slug),
  );
}

/** Indexable teams that actually appear in the fixtures, in curated order. */
export function indexableTeamLinks(events: PublicEvent[]): WcTeam[] {
  const present = teamsFromEvents(events);
  return INDEXABLE_TEAMS.map((name) => present.find((p) => p.slug === teamSlug(name))).filter(
    (t): t is WcTeam => Boolean(t),
  );
}
