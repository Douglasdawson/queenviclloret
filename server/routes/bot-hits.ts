import { Router } from "express";
import { requireRole } from "../middlewares/auth";
import * as botHitsDao from "../dao/bot-hits.dao";

export const crawlersRouter: Router = Router();

// Crawler analytics are read-only insight — staff and up.
crawlersRouter.use(requireRole("staff"));

/** Clamp the window to a small allow-list so the aggregate queries stay cheap. */
function days(raw: unknown): number {
  const n = Number(raw);
  return [1, 7, 30, 90].includes(n) ? n : 30;
}

crawlersRouter.get("/overview", async (req, res) => {
  const window = days(req.query.days);
  const [byCategory, byBot, topPaths, trend] = await Promise.all([
    botHitsDao.byCategory(window),
    botHitsDao.byBot(window),
    botHitsDao.topPaths(window),
    botHitsDao.dailyTrend(window),
  ]);
  res.json({ days: window, byCategory, byBot, topPaths, trend });
});

crawlersRouter.get("/recent", async (_req, res) => {
  res.json({ recent: await botHitsDao.recent(50) });
});
