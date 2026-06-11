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

## Design system ("Heritage Audaz")
Direction and tokens live in `PRODUCT.md` + `DESIGN.md` (impeccable context files; keep them
updated). Bottle green surfaces + cream paper + gold accents (OKLCH, in `client/src/styles.css`
@theme); one type family (Bricolage Grotesque Variable, self-hosted); signature devices:
perforated `.stamp-frame` (+ `.stamp-shadow` wrapper — filter must sit on the parent of the
mask), programme-ticket fixtures (`FixtureTicket`), laurel seal. Brand photos optimized via
`node scripts/optimize-images.mjs` (sources in `assets-src/`, output + manifest in
`client/public/images/`, typed manifest in `client/src/lib/image-manifest.ts`, consumed by
`<Picture/>`). Legacy `night-*`/`electric-*` tokens remain as aliases for the admin SPA only.

⚠️ CSP gotcha: in dev the CSP must NOT include a script nonce (a nonce makes browsers ignore
'unsafe-inline', which blocks Vite's react preamble and kills hydration). Prod uses the nonce.

⚠️ Local ports: 3000 AND 3100 are used by other projects on this machine (one binds IPv6, so
lsof may show two listeners). Local dev for this repo uses **PORT=3186** in `.env`.

## Status
Foundation + full heritage redesign complete: SSR + i18n (5 locales) + SEO/GEO, CRM modules
(leads/events/reservations/campaigns + providers + crons), public site redesigned via the full
impeccable cycle (shape → craft → critique ×2 agents → audit → polish). Lighthouse mobile:
A11y 100 · Best Practices 100 · SEO 100. Anti-slop verdict: pass.

## Next
Real address/phone/hours in footer + LocalBusiness JSON-LD when the owner provides them;
transparent World Cup logo asset; capacity slots logic; enable AI provider; migrate remaining
WP photos.
