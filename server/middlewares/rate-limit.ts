import rateLimit from "express-rate-limit";

/** Global limiter — 60 req/min per IP. */
export const globalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { code: "rate_limited", message: "Too many requests" } },
});

/** Auth limiter — 20 req / 15 min per IP. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { code: "rate_limited", message: "Too many attempts, try later" } },
});

/** Public form submissions — stricter: 10 / 10 min per IP. */
export const publicFormLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { code: "rate_limited", message: "Too many submissions, try later" } },
});
