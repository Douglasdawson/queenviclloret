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
- Provider abstractions: `server/services/providers/{email,whatsapp}` and `server/ai/` (selected by env).
- AI is **noop** today: endpoints `/leads/:id/summary`, `/events/:id/translate` return 501 until `AI_PROVIDER=anthropic`.

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

## Status
Foundation complete: SSR + i18n + SEO/GEO, schema, DAO/auth/leads/events/reservations routes,
public site (Home/SportsBar/WhatsOn/WorldCup/About/Reservations/Contact/FAQ), admin shell +
Dashboard/Leads/Events/Reservations, AI layer (noop), cron skeleton.

## Next
Campaigns + campaign_recipients module & send cron; email (Resend) + WhatsApp (Cloud API)
providers + webhooks; capacity slots logic; privacy/cookies pages; image pipeline; enable AI provider.
