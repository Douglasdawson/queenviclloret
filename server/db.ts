import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import { env } from "./env";
import { logger } from "./lib/logger";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  // Fail a stuck connect fast instead of hanging a request for minutes (the SSR
  // layer degrades gracefully on a fetch error — see server/ssr/render.ts).
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  // Neon and most managed Postgres require TLS.
  ssl: env.DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
});

// A pool-level error (e.g. an idle connection dropped by Neon) must never crash
// the process — log and let the pool recreate the connection on next use.
pool.on("error", (err) => {
  logger.error({ err }, "[db] idle client error");
});

export const db = drizzle(pool, { schema, casing: "snake_case" });

export type DB = typeof db;
export type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];
