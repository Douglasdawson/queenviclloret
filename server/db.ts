import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import { env } from "./env";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  // Neon and most managed Postgres require TLS.
  ssl: env.DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema, casing: "snake_case" });

export type DB = typeof db;
export type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];
