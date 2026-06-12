# Queen Vic Sports Bar — Web + CRM

SSR marketing site (5 languages, SEO + GEO) and an admin CRM for Queen Vic Sports Bar,
Lloret de Mar. React 18 + Vite 5 + Express 5 + Drizzle + PostgreSQL, deployed on Replit.
Sports fixtures (World Cup, Premier League, F1, MotoGP, Super League) auto-import from
TheSportsDB every 6h as drafts for one-click publish.

## Quick start
```bash
cp .env.example .env   # fill DATABASE_URL, SESSION_SECRET, SEED_OWNER_*
npm install
npm run db:push
npm run db:seed
npm run dev            # http://localhost:3000  (admin at /admin)
```

See `CLAUDE.md` for architecture and conventions.
