import { env } from "../../../env";
import { logger } from "../../../lib/logger";
import type { FixturesProvider, NormalizedFixture } from "./types";

/**
 * TheSportsDB league ids for everything Queen Vic shows.
 * Verify/extend at https://www.thesportsdb.com/league/<id> — the sync logs the
 * league name returned by the API so a wrong id is immediately visible.
 */
const LEAGUES: { id: string; sport: NormalizedFixture["sport"] }[] = [
  { id: "4429", sport: "football" }, // FIFA World Cup
  { id: "4328", sport: "football" }, // English Premier League
  { id: "4370", sport: "f1" }, // Formula 1
  { id: "4407", sport: "motogp" }, // MotoGP
  { id: "4415", sport: "rugby_league" }, // English Rugby League Super League
];
// NOTE: the free community key returns only ~1 upcoming event per league.
// A TheSportsDB Patreon key (FIXTURES_API_KEY) returns the full upcoming list.

interface TsdbEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strHomeTeam: string | null;
  strAwayTeam: string | null;
  dateEvent: string; // YYYY-MM-DD
  strTime: string | null; // HH:mm:ss (UTC)
  strTimestamp: string | null; // ISO UTC, preferred when present
}

export function createTheSportsDbProvider(): FixturesProvider {
  const key = env.FIXTURES_API_KEY || "123"; // free/community key
  const base = `https://www.thesportsdb.com/api/v1/json/${key}`;

  async function league(id: string, sport: NormalizedFixture["sport"]): Promise<NormalizedFixture[]> {
    const res = await fetch(`${base}/eventsnextleague.php?id=${id}`);
    if (!res.ok) {
      logger.warn({ league: id, status: res.status }, "[fixtures] league fetch failed");
      return [];
    }
    const json = (await res.json()) as { events: TsdbEvent[] | null };
    const events = json.events ?? [];
    if (events[0]) logger.info({ league: id, name: events[0].strLeague, count: events.length }, "[fixtures] fetched");

    return events
      .map((e) => {
        const startsAt = e.strTimestamp
          ? new Date(e.strTimestamp.endsWith("Z") ? e.strTimestamp : `${e.strTimestamp}Z`)
          : new Date(`${e.dateEvent}T${e.strTime ?? "12:00:00"}Z`);
        if (Number.isNaN(startsAt.getTime())) return null;
        return {
          externalRef: `tsdb:${e.idEvent}`,
          title: e.strEvent,
          sport,
          competition: e.strLeague,
          homeTeam: e.strHomeTeam,
          awayTeam: e.strAwayTeam,
          startsAt,
        } satisfies NormalizedFixture;
      })
      .filter((x): x is NormalizedFixture => x !== null);
  }

  return {
    name: "thesportsdb",
    enabled: true,
    async fetchUpcoming() {
      const all: NormalizedFixture[] = [];
      // Sequential: the free tier rate-limits aggressively.
      for (const l of LEAGUES) {
        try {
          all.push(...(await league(l.id, l.sport)));
        } catch (err) {
          logger.error({ league: l.id, err }, "[fixtures] league sync error");
        }
      }
      return all;
    },
  };
}

export const noopFixturesProvider: FixturesProvider = {
  name: "noop",
  enabled: false,
  async fetchUpcoming() {
    return [];
  },
};
