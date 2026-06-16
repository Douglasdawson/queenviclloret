export interface NormalizedFixture {
  /** Stable upstream id — used as events.externalRef for idempotent upserts. */
  externalRef: string;
  title: string;
  sport: "football" | "f1" | "motogp" | "rugby_league" | "gaa" | "boxing" | "other";
  competition: string;
  homeTeam: string | null;
  awayTeam: string | null;
  startsAt: Date;
  /** Live result, when the feed has played/in-progress data. */
  homeScore?: number | null;
  awayScore?: number | null;
  scoreStatus?: string | null; // "FT" | "HT" | "LIVE" | null
}

export interface FixturesProvider {
  readonly name: string;
  readonly enabled: boolean;
  /** Upcoming fixtures for every configured competition. */
  fetchUpcoming(): Promise<NormalizedFixture[]>;
}
