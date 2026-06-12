import { Router } from "express";
import { env } from "../env";
import { cached, TTL } from "../cache";
import { LOCALES } from "@shared/enums";
import * as eventsDao from "../dao/events.dao";

export const seoRouter: Router = Router();

const BASE = env.PUBLIC_BASE_URL.replace(/\/$/, "");

// Static public paths (without locale prefix).
const STATIC_PATHS = [
  "",
  "sports-bar",
  "whats-on",
  "world-cup-2026",
  "events",
  "about",
  "reservations",
  "contact",
  "faq",
  "privacy",
  "cookies",
];

seoRouter.get("/robots.txt", (_req, res) => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Allow AI/answer engines (GEO)",
    "User-agent: GPTBot",
    "Allow: /",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "User-agent: PerplexityBot",
    "Allow: /",
    "User-agent: ClaudeBot",
    "Allow: /",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "# Keep crawlers out of the admin app & API",
    "User-agent: *",
    "Disallow: /admin",
    "Disallow: /api",
    "",
    `Sitemap: ${BASE}/sitemap.xml`,
    "",
  ].join("\n");
  res.type("text/plain").send(body);
});

seoRouter.get("/sitemap.xml", async (_req, res) => {
  const xml = await cached("seo:sitemap", TTL.MEDIUM, async () => {
    const events = await eventsDao.listPublicUpcoming(200);
    const urls: { loc: string }[] = [];
    for (const p of STATIC_PATHS) {
      for (const lang of LOCALES) {
        urls.push({ loc: `${BASE}/${lang}${p ? "/" + p : ""}` });
      }
    }
    for (const e of events) {
      for (const lang of LOCALES) {
        urls.push({ loc: `${BASE}/${lang}/events/${e.slug}` });
      }
    }

    const entries = urls
      .map((u) => {
        const alternates = LOCALES.map((lang) => {
          // derive the same path under each locale
          const rest = u.loc.replace(`${BASE}/`, "").split("/").slice(1).join("/");
          const href = `${BASE}/${lang}${rest ? "/" + rest : ""}`;
          return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
        }).join("\n");
        const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${u.loc.replace(/\/(en|es|ca|fr|nl)(\/|$)/, "/en$2")}"/>`;
        return `  <url>\n    <loc>${u.loc}</loc>\n${alternates}\n${xdefault}\n  </url>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
  });
  res.type("application/xml").send(xml);
});

seoRouter.get("/llms.txt", (_req, res) => {
  const body = `# Queen Vic Sports Bar — Lloret de Mar

> The original sports bar in Lloret de Mar (Costa Brava, Spain) since 1986. The biggest terrace in town (1,250 m²), a giant outdoor screen, 14+ screens, and a live resident DJ every night.

## About
Queen Vic has shown live sport in Lloret de Mar for 40 years. It is the home of British and Irish fans on the Costa Brava and the go-to venue for big match days and World Cup nights.

## What we show
- Football: Premier League and FIFA World Cup 2026 (every match, giant outdoor screen)
- Formula 1 and MotoGP (selected races)
- Rugby League
- GAA

## Venue
- 1,250 m² terrace, open day and night
- Giant outdoor screen + 4 outdoor TVs + 10 indoor screens
- Full English commentary on major fixtures
- Live resident DJ after the final whistle

## Practical
- Address: Carrer de la Costa de Carbonell 1, 17310 Lloret de Mar, Costa Brava, Girona, Catalonia, Spain
- Phone: +34 674 46 12 20
- Hours: vary with the season and the fixture list (evenings till late; earlier on big match days)
- Rating: 4.1/5 on Tripadvisor (116 reviews)
- Languages: English, Spanish, Catalan, French, Dutch
- Reservations: groups and match days recommended to book ahead
- Schedule & fixtures: ${BASE}/en/whats-on

## Key pages
- Home: ${BASE}/en
- What's On (fixtures): ${BASE}/en/whats-on
- World Cup 2026: ${BASE}/en/world-cup-2026
- Reservations: ${BASE}/en/reservations
- Contact: ${BASE}/en/contact
`;
  res.type("text/plain").send(body);
});
