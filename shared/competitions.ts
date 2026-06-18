// Curated competitions we publish evergreen "where to watch X in Lloret" pages for.
// Shared by the client (the /watch/:slug page) and the server (sitemap) so the
// slug set is identical on both sides — same pattern as shared/wc-slug.ts.
//
// Fixtures come from TheSportsDB (server/services/providers/fixtures/thesportsdb.provider.ts):
// `sport` is our enum, `competition` is the league name (strLeague), e.g.
// "English Premier League", "Formula 1", "MotoGP", "English Rugby League Super League".

export interface Competition {
  /** URL slug, e.g. "premier-league". */
  slug: string;
  /** Display name (proper noun, kept across all locales). */
  name: string;
  /** Our sport enum (see shared/enums.ts sportType). */
  sport: string;
  /** Optional lowercased substring the `competition` string must contain
   *  (disambiguates competitions that share a sport, e.g. football). */
  competitionLike?: string;
}

export const COMPETITIONS: Competition[] = [
  { slug: "premier-league", name: "Premier League", sport: "football", competitionLike: "premier league" },
  { slug: "champions-league", name: "Champions League", sport: "football", competitionLike: "champions league" },
  { slug: "formula-1", name: "Formula 1", sport: "f1" },
  { slug: "motogp", name: "MotoGP", sport: "motogp" },
  { slug: "rugby-league", name: "Rugby League", sport: "rugby_league" },
  { slug: "gaa", name: "GAA", sport: "gaa" },
];

export function competitionFromSlug(slug: string): Competition | undefined {
  return COMPETITIONS.find((c) => c.slug === slug);
}

/** Does an event (by sport + competition string) belong to this competition? */
export function eventMatchesCompetition(
  c: Competition,
  ev: { sport: string; competition: string | null },
): boolean {
  if (ev.sport !== c.sport) return false;
  if (!c.competitionLike) return true;
  return (ev.competition ?? "").toLowerCase().includes(c.competitionLike);
}
