import { Router } from "express";
import { authRouter } from "./auth";
import { leadsRouter } from "./leads";
import { eventsRouter } from "./events";
import { reservationsRouter } from "./reservations";
import { campaignsRouter } from "./campaigns";
import { publicRouter } from "./public";

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
