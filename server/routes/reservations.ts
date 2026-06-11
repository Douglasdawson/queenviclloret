import { Router } from "express";
import { validate } from "../middlewares/validate";
import { requireRole } from "../middlewares/auth";
import { AppError } from "../middlewares/error-handler";
import {
  listReservationsQuerySchema,
  updateReservationSchema,
} from "@shared/validation/reservations";
import * as reservationsDao from "../dao/reservations.dao";

export const reservationsRouter: Router = Router();

reservationsRouter.use(requireRole("staff"));

reservationsRouter.get("/", validate(listReservationsQuerySchema, "query"), async (req, res) => {
  res.json(await reservationsDao.listReservations(req.query as never));
});

reservationsRouter.get("/:id", async (req, res) => {
  const reservation = await reservationsDao.getReservation((req.params.id as string));
  if (!reservation) throw new AppError(404, "not_found", "Reservation not found");
  res.json({ reservation });
});

reservationsRouter.patch(
  "/:id",
  requireRole("manager"),
  validate(updateReservationSchema),
  async (req, res) => {
    const reservation = await reservationsDao.updateReservation((req.params.id as string), req.body, req.audit);
    if (!reservation) throw new AppError(404, "not_found", "Reservation not found");
    res.json({ reservation });
  },
);

reservationsRouter.post("/:id/confirm", requireRole("manager"), async (req, res) => {
  const reservation = await reservationsDao.confirmReservation((req.params.id as string), req.audit);
  if (!reservation) throw new AppError(404, "not_found", "Reservation not found");
  res.json({ reservation });
});

reservationsRouter.post("/:id/cancel", requireRole("manager"), async (req, res) => {
  const reservation = await reservationsDao.cancelReservation(
    (req.params.id as string),
    req.body?.reason,
    req.audit,
  );
  if (!reservation) throw new AppError(404, "not_found", "Reservation not found");
  res.json({ reservation });
});
