# queenviclloret — Claude Code Context

Website + admin CRM for **Queen Vic Sports Bar**, Lloret de Mar (Costa Brava). Public
SSR site (5 languages, SEO/GEO) + an admin panel that acts as a CRM, architected to add
AI features later.

## Stack
- Backend: Express 5 + TypeScript + Drizzle ORM + Pino + Zod + bcryptjs + express-session
- Frontend: React 18 + Vite 5 + TypeScript + Tailwind v4 + Radix UI + TanStack Query + Wouter
- DB: PostgreSQL (Neon) — `pg` driver, Drizzle `casing: "snake_case"`
- Testing: Vitest + Playwright
- Deploy: Replit Autoscale

## Architecture (important deviation from the standard SPA bootstrap)
This app is **SSR**, not a SPA. A single Express process serves `/api`, server-renders the
public pages (Vite middleware in dev, `dist/ssr` bundle in prod), and serves `dist/client`
static assets. This was required for SEO + GEO (a Vite SPA renders an empty shell to crawlers).
- `server/index.ts` — middleware order: nonce → helmet(CSP) → compression → SEO routes →
  `/api` (json → session → audit → rate-limit → routes) → Vite/static → root locale redirect → SSR → errors.
- `client/src/entry-server.tsx` / `entry-client.tsx` — render + hydrate (Wouter `ssrPath` + `base`,
  per-request i18next instance, TanStack Query dehydrate/hydrate).
- `server/ssr/render.ts` — caches the React render per `lang:path`; rebuilds the document with a
  fresh CSP nonce each request (so HTML caching never breaks CSP).
- i18n: route prefix `/en|/es|/ca|/fr|/nl`. `/` redirects by Accept-Language. Language switch is a
  full navigation (SEO-friendly, avoids router base churn).

## Workflow
Mac terminal (Claude Code) → `git push origin main` → in Replit Git tab → Pull → Deployments → Redeploy.
**No Vercel/Netlify/Cloudflare.** Production runs via `tsx` (no tsc server build) to avoid ESM
extension issues on Replit.

## Patterns (don't change without strong reason)
- DAO layer in `server/dao/*` — routes never touch `db` directly.
- Soft deletes on every table (`isDeleted/deletedAt/deletedBy`) except `audit_log` (append-only) and `session`.
- `audit_log` written inside the same tx as the mutation (`writeAudit` in `base.dao.ts`).
- Pino with redact of credentials + PII.
- Rate limiting dual-layer (global 60/min, auth 20/15min, public forms 10/10min).
- Cron jobs wrapped in `withAdvisoryLock` (Postgres advisory locks) — safe across Autoscale instances.
- Provider abstractions: `server/services/providers/{email,whatsapp,fixtures}` and `server/ai/` (selected by env).
- AI is **noop** today: endpoints `/leads/:id/summary`, `/events/:id/translate` return 501 until `AI_PROVIDER=anthropic`.

## Fixtures auto-import
TheSportsDB feed (`FIXTURES_PROVIDER=thesportsdb`) pulls upcoming World Cup / Premier League /
F1 / MotoGP / Super League fixtures (league ids in `thesportsdb.provider.ts` — note 4415 is
Super League; 4414 is rugby *union*). Cron every 6h (`15 */6 * * *`) + `POST /api/events/sync`
+ "Sync fixtures" button in admin. Idempotent upsert keyed on `externalRef` (`tsdb:<idEvent>`):
inserts as **draft** (publish is 1 click; `FIXTURES_AUTO_PUBLISH=true` to skip review), updates
title/teams/startsAt if upstream changes, never touches rows an admin edited (`updatedBy` set).
Free community key returns only ~1 upcoming event per league; a TheSportsDB Patreon key in
`FIXTURES_API_KEY` unlocks full lists (recommended for the World Cup).
⚠️ zod footgun: `z.coerce.boolean()` is `Boolean("false") === true` — booleans from env use a
string transform (see `FIXTURES_AUTO_PUBLISH` in `server/env.ts`).

## Commands
- `npm run dev` — single Express process with Vite SSR middleware (http://localhost:3000)
- `npm run build` — `vite build` (client) + `vite build --ssr` (ssr bundle)
- `npm run start` — production (tsx)
- `npm run db:push` / `db:studio` / `db:seed`
- `npm run test` (Vitest) / `npm run test:e2e` (Playwright)
- `npm run i18n:validate` — keys consistent across en/es/ca/fr/nl
- `npm run typecheck`

## First-run setup
1. Neon DB → copy connection string.
2. `cp .env.example .env` → fill `DATABASE_URL`, `SESSION_SECRET` (`openssl rand -hex 32`),
   `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD`.
3. `npm run db:push` then `npm run db:seed`.
4. `npm run dev` → http://localhost:3000 (public) and /admin (CRM).

## Design system ("Heritage Audaz")
Direction and tokens live in `PRODUCT.md` + `DESIGN.md` (impeccable context files; keep them
updated). Bottle green surfaces + cream paper + gold accents (OKLCH, in `client/src/styles.css`
@theme); one type family (Bricolage Grotesque Variable, self-hosted); signature devices:
perforated `.stamp-frame` (+ `.stamp-shadow` wrapper — filter must sit on the parent of the
mask), programme-ticket fixtures (`FixtureTicket`), laurel seal, **floating panels**: cream is
the page paper; the header is a sticky rounded pill and every green/deep `Section` surface
(heroes, footer, Home hero) floats as a rounded panel (radii/gutters defined in `ui.tsx`
`panel` const). Client-side route changes scroll to top (`ScrollToTop` in `PublicLayout`).
Brand photos optimized via
`node scripts/optimize-images.mjs` (sources in `assets-src/`, output + manifest in
`client/public/images/`, typed manifest in `client/src/lib/image-manifest.ts`, consumed by
`<Picture/>`). Legacy `night-*`/`electric-*` tokens remain as aliases for the admin SPA only.

⚠️ CSP gotcha: in dev the CSP must NOT include a script nonce (a nonce makes browsers ignore
'unsafe-inline', which blocks Vite's react preamble and kills hydration). Prod uses the nonce.

⚠️ Local ports: 3000 AND 3100 are used by other projects on this machine (one binds IPv6, so
lsof may show two listeners). Local dev for this repo uses **PORT=3186** in `.env`.
`playwright.config.ts` reads PORT from the env too — e2e spawns its own server, so stop any
running dev server before `npm run test:e2e`.

## Status
Foundation + full heritage redesign complete: SSR + i18n (5 locales) + SEO/GEO, CRM modules
(leads/events/reservations/campaigns + providers + crons), public site redesigned via the full
impeccable cycle (shape → craft → critique ×2 agents → audit → polish). Lighthouse mobile:
A11y 100 · Best Practices 100 · SEO 100. Anti-slop verdict: pass. Real venue data live
(Carrer de la Costa de Carbonell 1 · +34 610 21 71 15 · daily 19:00–03:00) in footer,
BarOrPub JSON-LD and llms.txt; venue-own WP photos migrated (press/stock excluded — licensing);
heritage admin re-skin; fixtures auto-import verified against the live API.
Legal pages complete (5 locales, in footer + sitemap): Privacy + Cookie policies, plus Aviso
Legal (LSSI-CE), Terms of Use and Accessibility statement. Content lives in
`client/src/content/legal.ts`; fiscal identity (TURALIA SL · CIF B17113374 · S.L. · fiscal
domicile Paseo Agustí Font 12 · legal contact administracion@turalia.org) is the single source
of truth in `shared/venue.ts` `legal` block, hosted on Replit (LucusHost = DNS only).
Analytics live: GA4 (`G-RB2T3WBR6X`) + GSC (meta-tag verified). GA4 uses **Google Consent
Mode v2** (`client/src/analytics/Analytics.tsx`) — the tag loads on every public page with
`analytics_storage` denied by default (cookieless modeled pings) and upgrades to granted on
"accept all"; `ad_*` stay denied. AI/search **crawler telemetry**: `bot_hits` table +
`server/middlewares/bot-tracking.ts` (fire-and-forget, UA detector in `shared/bots.ts`) feed
`/admin/crawlers` (category totals, daily chart, per-bot + top-paths). GA4 can't see crawlers
(bots run no JS), so this is the only place they're visible. `bot_hits` self-creates on boot via
`ensure-schema` (`drizzle/0004`); daily cleanup cron prunes >90d.

## Next (CRM, agreed punto-por-punto sequence)
1. ~~Load real fixtures~~ ✅ automated (TheSportsDB sync).
2. ~~Lead detail view~~ ✅ slide-over in /admin/leads: contact + GDPR consent badges, UTM
   attribution, tags (chips + inline create via `GET/POST /api/leads/tags` — create is
   case-insensitive idempotent), pinned notes, audit_log activity timeline with actor names,
   AI summary button (501 until enabled).
3. ~~Kanban pipeline view~~ ✅ table/board toggle in /admin/leads (persisted in localStorage);
   native HTML5 drag & drop between the 5 status columns, optimistic move with rollback,
   board fetches `limit=100` (the API's max page size). Card click opens the detail panel.
4. Activate real email via Resend (owner must create account, verify the domain's DNS
   records, and provide the API key for `.env` + Replit Secrets).

**No sport before 20:00 (owner decision, 2026-07-11):** the public site never advertises
fixtures kicking off before 20:00 Europe/Madrid; late-night kick-offs (00:00–02:59, World Cup
games from the Americas) stay visible. Enforced once in `server/dao/events.dao.ts`
(`advertisableHours`, applied to the three public reads → API, SSR, sitemap, llms.txt — admin
sees everything). "Every match / todos los partidos" marketing claims were softened to
"evening matches (from 20:00)" across the 5 locales + seo.ts GEO answers. Same date: removed
the "fry-ups" mention from `heritageBody` in all locales.

**No reservations (owner decision, 2026-07-06):** the venue is walk-in only and "never will"
take table bookings. Removed from the public site: /reservations page + route (301 → /contact),
ReserveButton/ReservationModal/ReservationForm, `POST /api/public/reservation`, sitemap entry,
`reservations.*` locale keys; CTAs replaced by `WhatsAppCta` (wa.me); FAQ/llms.txt copy now says
first-come-first-served; JSON-LD has `acceptsReservations: "False"`; legal pages rewritten.
The **admin** reservations module (DAO, routes, cron, schema) remains but can no longer receive
public submissions — don't resurrect public booking UI without an explicit owner request.

Later: enable AI provider (`AI_PROVIDER=anthropic`); TheSportsDB Patreon
key for full fixture lists; production deploy (Replit secrets, db:push, db:seed, 301s from old
WP URLs).
