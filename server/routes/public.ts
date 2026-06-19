import { Router } from "express";
import { validate } from "../middlewares/validate";
import { publicFormLimiter } from "../middlewares/rate-limit";
import { AppError } from "../middlewares/error-handler";
import { contactFormSchema } from "@shared/validation/leads";
import { reservationRequestSchema } from "@shared/validation/reservations";
import * as leadsDao from "../dao/leads.dao";
import * as reservationsDao from "../dao/reservations.dao";
import * as eventsDao from "../dao/events.dao";
import * as recipientsDao from "../dao/campaign-recipients.dao";
import * as postsDao from "../dao/posts.dao";
import * as categoriesDao from "../dao/post-categories.dao";
import * as usersDao from "../dao/users.dao";
import { toPublicListItem, toPublicDetail, toPublicCategory } from "../lib/post-serialize";
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

/** World Cup schedule + live results. Polled by the client (near-live). */
publicRouter.get("/world-cup", async (_req, res) => {
  const events = await cached("api:public:worldcup", TTL.SHORT, () => eventsDao.listWorldCup());
  res.json({ events });
});

publicRouter.get("/events/:slug", async (req, res) => {
  const event = await eventsDao.getPublicEventBySlug((req.params.slug as string));
  if (!event) throw new AppError(404, "not_found", "Event not found");
  res.json({ event });
});

/* ------------------------------------------------------------- blog (public) */
publicRouter.get("/post-categories", async (_req, res) => {
  const categories = await cached("api:public:post-categories", TTL.MEDIUM, async () =>
    (await categoriesDao.listCategories()).map(toPublicCategory),
  );
  res.json({ categories });
});

publicRouter.get("/posts", async (req, res) => {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
  const posts = await cached(`api:public:posts:${categorySlug ?? "all"}`, TTL.SHORT, async () => {
    let categoryId: string | undefined;
    if (categorySlug) {
      const cats = await categoriesDao.listCategories();
      categoryId = cats.find((c) => c.slug === categorySlug)?.id;
      if (!categoryId) return [];
    }
    const rows = await postsDao.listPublicPosts({ categoryId, limit: 50 });
    return rows.map(toPublicListItem);
  });
  res.json({ posts });
});

publicRouter.get("/posts/:slug", async (req, res) => {
  const post = await postsDao.getPublicPostBySlug(req.params.slug as string);
  if (!post) throw new AppError(404, "not_found", "Post not found");
  const [related, author] = await Promise.all([
    postsDao.listRelatedPosts(post.categoryId, post.id, 3),
    post.authorId ? usersDao.findById(post.authorId) : Promise.resolve(undefined),
  ]);
  res.json({
    post: toPublicDetail(post, { related, author: author ? { name: author.name } : null }),
  });
});

// One-click unsubscribe (marketing compliance). Idempotent.
publicRouter.get("/unsubscribe/:token", async (req, res) => {
  const recipient = await recipientsDao.findByToken(req.params.token as string);
  if (recipient) {
    await recipientsDao.markByToken(req.params.token as string, "unsubscribed", new Date());
    await leadsDao.updateLead(
      recipient.leadId,
      { consentEmail: false, consentWhatsapp: false, consentUpdatedAt: new Date() },
      req.audit,
    );
  }
  res.type("text/html").send(
    "<!doctype html><meta charset='utf-8'><title>Unsubscribed</title><body style='font-family:system-ui;background:#07080d;color:#f4f6fb;display:grid;place-items:center;height:100vh'><div style='text-align:center'><h1>You're unsubscribed</h1><p>You won't receive further marketing messages from Queen Vic.</p></div>",
  );
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
