import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { env, isProd } from "./env";

const PgStore = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgStore({
    pool,
    tableName: "session",
    createTableIfMissing: true,
    pruneSessionInterval: 60 * 60, // hourly
  }),
  name: "qv.sid",
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
    role?: string;
  }
}
