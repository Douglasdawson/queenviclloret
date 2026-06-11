import { Router } from "express";
import { validate } from "../middlewares/validate";
import { requireRole } from "../middlewares/auth";
import { AppError } from "../middlewares/error-handler";
import { listEventsQuerySchema, upsertEventSchema } from "@shared/validation/events";
import * as eventsDao from "../dao/events.dao";
import { ai, AINotImplementedError } from "../ai";

export const eventsRouter: Router = Router();

eventsRouter.use(requireRole("staff"));

eventsRouter.get("/", validate(listEventsQuerySchema, "query"), async (req, res) => {
  res.json(await eventsDao.listEvents(req.query as never));
});

eventsRouter.get("/:id", async (req, res) => {
  const event = await eventsDao.getEventById((req.params.id as string));
  if (!event) throw new AppError(404, "not_found", "Event not found");
  res.json({ event });
});

eventsRouter.post("/", requireRole("manager"), validate(upsertEventSchema), async (req, res) => {
  const event = await eventsDao.createEvent(req.body, req.audit);
  res.status(201).json({ event });
});

eventsRouter.patch(
  "/:id",
  requireRole("manager"),
  validate(upsertEventSchema.partial()),
  async (req, res) => {
    const event = await eventsDao.updateEvent((req.params.id as string), req.body, req.audit);
    if (!event) throw new AppError(404, "not_found", "Event not found");
    res.json({ event });
  },
);

eventsRouter.post("/:id/publish", requireRole("manager"), async (req, res) => {
  const event = await eventsDao.setEventStatus((req.params.id as string), "published", req.audit);
  if (!event) throw new AppError(404, "not_found", "Event not found");
  res.json({ event });
});

eventsRouter.post("/:id/feature", requireRole("manager"), async (req, res) => {
  const event = await eventsDao.setEventFeatured((req.params.id as string), req.body?.isFeatured !== false, req.audit);
  if (!event) throw new AppError(404, "not_found", "Event not found");
  res.json({ event });
});

eventsRouter.delete("/:id", requireRole("admin"), async (req, res) => {
  const ok = await eventsDao.removeEvent((req.params.id as string), req.audit);
  if (!ok) throw new AppError(404, "not_found", "Event not found");
  res.json({ ok });
});

/** AI placeholder — auto-translate event copy to all locales (noop today). */
eventsRouter.post("/:id/translate", requireRole("manager"), async (req, res) => {
  const event = await eventsDao.getEventById((req.params.id as string));
  if (!event) throw new AppError(404, "not_found", "Event not found");
  try {
    const translations = await ai.translate(event.description ?? event.title, ["es", "ca", "fr", "nl"]);
    res.json({ translations });
  } catch (err) {
    if (err instanceof AINotImplementedError) {
      throw new AppError(501, "ai_disabled", "AI features are not enabled yet");
    }
    throw err;
  }
});
