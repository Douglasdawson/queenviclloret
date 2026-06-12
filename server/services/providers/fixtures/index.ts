import { env } from "../../../env";
import type { FixturesProvider } from "./types";
import { createTheSportsDbProvider, noopFixturesProvider } from "./thesportsdb.provider";

function select(): FixturesProvider {
  if (env.FIXTURES_PROVIDER === "thesportsdb") return createTheSportsDbProvider();
  return noopFixturesProvider;
}

export const fixturesProvider: FixturesProvider = select();
export * from "./types";
