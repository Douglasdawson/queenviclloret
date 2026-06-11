import { Router } from "express";
import { validate } from "../middlewares/validate";
import { publicFormLimiter } from "../middlewares/rate-limit";
import { AppError } from "../middlewares/error-handler";
import { contactFormSchema } from "@shared/validation/leads";
import { reservationRequestSchema } from "@shared/validation/reservations";
import * as leadsDao from "../dao/leads.dao";
import * as reservationsDao from "../dao/reservations.dao";
import * as eventsDao from "../dao/events.dao";
import { cached, TTL } from "../cache";
import type { ContactFormInput } from "@shared/validation/leads";
import type { ReservationRequestInput } from "@shared/validation/reservations";

export const publicRouter: Router = Router();

/** Public events feed for the client (What's On). SSR loads via DAO directly. */
publicRouter.get("/events", async (_req, res) => {
  const events = await cached("api:public:events", TTL.SHORT, () =>
    eventsDao.listPublicUpcoming(50),
  );
  res.json({ events });
});

publicRouter.get("/events/:slug", async (req, res) => {
  const event = await eventsDao.getPublicEventBySlug((req.params.slug as string));
  if (!event) throw new AppError(404, "not_found", "Event not found");
  res.json({ event });
});

publicRouter.post("/contact", publicFormLimiter, validate(contactFormSchema), async (req, res) => {
  const body = req.body as ContactFormInput;
  if (body.company) throw new AppError(400, "spam_detected", "Rejected"); // honeypot

  const lead = await leadsDao.createLead(
    {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      partySize: body.partySize ?? null,
      preferredLang: body.preferredLang ?? null,
      message: body.message,
      source: "web_form",
      consentEmail: body.consentEmail,
      consentWhatsapp: body.consentWhatsapp,
      consentUpdatedAt: new Date(),
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
      utmTerm: body.utmTerm,
      utmContent: body.utmContent,
      referrer: body.referrer,
      landingPage: body.landingPage,
      sbData: body.sbData ?? null,
    },
    req.audit,
  );
  res.status(201).json({ ok: true, id: lead.id });
});

publicRouter.post(
  "/reservation",
  publicFormLimiter,
  validate(reservationRequestSchema),
  async (req, res) => {
    const body = req.body as ReservationRequestInput;
    if (body.company) throw new AppError(400, "spam_detected", "Rejected"); // honeypot

    // create/attach a lead for CRM continuity
    const lead = await leadsDao.createLead(
      {
        firstName: body.name,
        email: body.email,
        phone: body.phone,
        partySize: body.partySize,
        message: body.specialRequests ?? null,
        source: "reservation",
        consentEmail: body.consentEmail,
        consentWhatsapp: body.consentWhatsapp,
        consentUpdatedAt: new Date(),
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        referrer: body.referrer,
        landingPage: body.landingPage,
        sbData: body.sbData ?? null,
      },
      req.audit,
    );

    const reservation = await reservationsDao.createReservation(
      {
        leadId: lead.id,
        eventId: body.eventId ?? null,
        name: body.name,
        email: body.email,
        phone: body.phone,
        partySize: body.partySize,
        reservationType: body.reservationType,
        date: body.date,
        timeSlot: body.timeSlot ?? null,
        specialRequests: body.specialRequests ?? null,
        status: "pending",
        source: "web_form",
      },
      req.audit,
    );
    res.status(201).json({ ok: true, id: reservation.id });
  },
);
