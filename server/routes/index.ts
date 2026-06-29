import { Router } from "express";
import { authRouter } from "./auth";
import { leadsRouter } from "./leads";
import { eventsRouter } from "./events";
import { reservationsRouter } from "./reservations";
import { campaignsRouter } from "./campaigns";
import { postsRouter } from "./posts";
import { usersRouter } from "./users";
import { publicRouter } from "./public";
import { crawlersRouter } from "./bot-hits";

export const apiRouter: Router = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/public", publicRouter);
apiRouter.use("/leads", leadsRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/reservations", reservationsRouter);
apiRouter.use("/campaigns", campaignsRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/crawlers", crawlersRouter);
