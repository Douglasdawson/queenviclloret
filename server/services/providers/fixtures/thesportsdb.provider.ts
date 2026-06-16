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
  intHomeScore: string | null; // present on played events
  intAwayScore: string | null;
  strStatus: string | null; // "Match Finished" | "FT" | "HT" | "1H" | "2H" | "NS" | ...
}

/** Normalize TheSportsDB's free-form status into our small set. */
function toScoreStatus(s: string | null, hasScore: boolean): string | null {
  if (!s) return hasScore ? "FT" : null;
  const v = s.trim().toUpperCase();
  if (v === "FT" || v.includes("FINISH") || v.includes("FULL TIME") || v === "AET" || v === "PEN") return "FT";
  if (v === "HT" || v.includes("HALF")) return "HT";
  if (v === "NS" || v.includes("NOT STARTED") || v === "" || v === "TBD") return null;
  // "1H", "2H", "Live", minute counts, etc.
  return hasScore ? "LIVE" : null;
}

function toScore(v: string | null): number | null {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function createTheSportsDbProvider(): FixturesProvider {
  const key = env.FIXTURES_API_KEY || "123"; // free/community key
  const base = `https://www.thesportsdb.com/api/v1/json/${key}`;

  function mapEvent(e: TsdbEvent, sport: NormalizedFixture["sport"]): NormalizedFixture | null {
    const startsAt = e.strTimestamp
      ? new Date(e.strTimestamp.endsWith("Z") ? e.strTimestamp : `${e.strTimestamp}Z`)
      : new Date(`${e.dateEvent}T${e.strTime ?? "12:00:00"}Z`);
    if (Number.isNaN(startsAt.getTime())) return null;
    const homeScore = toScore(e.intHomeScore);
    const awayScore = toScore(e.intAwayScore);
    const hasScore = homeScore !== null && awayScore !== null;
    return {
      externalRef: `tsdb:${e.idEvent}`,
      title: e.strEvent,
      sport,
      competition: e.strLeague,
      homeTeam: e.strHomeTeam,
      awayTeam: e.strAwayTeam,
      startsAt,
      homeScore,
      awayScore,
      scoreStatus: toScoreStatus(e.strStatus, hasScore),
    } satisfies NormalizedFixture;
  }

  async function endpoint(path: string, id: string): Promise<TsdbEvent[]> {
    const res = await fetch(`${base}/${path}?id=${id}`);
    if (!res.ok) {
      logger.warn({ league: id, path, status: res.status }, "[fixtures] league fetch failed");
      return [];
    }
    const json = (await res.json()) as { events: TsdbEvent[] | null };
    return json.events ?? [];
  }

  /** Upcoming + recently played (with scores), deduped by id (played wins). */
  async function league(id: string, sport: NormalizedFixture["sport"]): Promise<NormalizedFixture[]> {
    const next = await endpoint("eventsnextleague.php", id);
    const past = await endpoint("eventspastleague.php", id);
    const sample = next[0] ?? past[0];
    if (sample) logger.info({ league: id, name: sample.strLeague, next: next.length, past: past.length }, "[fixtures] fetched");

    const byRef = new Map<string, NormalizedFixture>();
    // Past last so played results overwrite any upcoming duplicate.
    for (const e of [...next, ...past]) {
      const m = mapEvent(e, sport);
      if (m) byRef.set(m.externalRef, m);
    }
    return [...byRef.values()];
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
