import type { NextFunction, Request, Response } from "express";
import { detectBot } from "@shared/bots";
import * as botHitsDao from "../dao/bot-hits.dao";
import { logger } from "../lib/logger";

// Static assets aren't interesting crawler signals (the AI/search bots that
// matter fetch HTML pages + the SEO files). robots.txt/sitemap.xml/llms.txt are
// deliberately NOT excluded — those are high-value AI-discovery requests.
const ASSET_EXT = /\.(js|mjs|css|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot)$/i;

/**
 * Records AI/search crawler hits to the bot_hits table. Mounted early (before
 * the SEO router) so it sees SEO endpoints and SSR pages alike. Telemetry only:
 * it calls next() immediately and writes on response 'finish', so it can never
 * delay or break a request — a DB error is swallowed at debug level.
 */
export function botTracking(req: Request, res: Response, next: NextFunction): void {
  const bot = req.method === "GET" ? detectBot(req.get("user-agent")) : null;
  const path = req.path;
  const skip =
    !bot ||
    path.startsWith("/api") ||
    path.startsWith("/admin") ||
    path.startsWith("/assets") ||
    ASSET_EXT.test(path);

  if (!skip) {
    res.on("finish", () => {
      void botHitsDao
        .recordHit({
          botName: bot.name,
          category: bot.category,
          path: path.slice(0, 512),
          statusCode: res.statusCode,
          ip: req.ip ?? null,
          userAgent: (req.get("user-agent") ?? "").slice(0, 512),
        })
        .catch((err) => logger.debug({ err }, "[bot-tracking] record failed"));
    });
  }

  next();
}
