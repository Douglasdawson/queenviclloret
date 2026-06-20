# Queen Vic — SEO/GEO playbook & competitor analysis

_Research: 2026-06-20. No GSC access (Google blocks the automation browser); signals from SERPs,
Facebook groups, TripAdvisor/Yelp/Google listings and competitor copy. Treat review counts as
directional — they move constantly._

## TL;DR
- **Biggest win already live:** Queen Vic ranks **#1 for "watch World Cup 2026 Lloret de Mar"** via real
  indexable pages. Competitors push the World Cup almost entirely on **Instagram (not indexable)** → open goal.
- **Structural moat:** a real **multilingual SSR site** (EN/ES/CA/FR/NL). Rivals are English + Instagram.
  Dutch/French "voetbal kijken / regarder le foot Lloret" is essentially uncontested.
- **Defensible USP:** biggest **outdoor terrace (1,250 m²) + 200-inch outdoor screen** — nobody else can claim it.
- **The one real weakness: review volume/rating.** This is the highest-ROI off-page fix (see §3).

## Priority keywords (use the exact phrasing tourists use)
Ranked by value. EN/ES/NL/FR matter — Lloret's tourists are British, Dutch, French, Spanish.
1. `sports bar Lloret de Mar` · `best sports bar Lloret de Mar`
2. **World Cup 2026 cluster** (per-nation, per-fixture, per-language) — time-boxed, highest conversion, lowest web competition
3. `where to watch football Lloret de Mar` / `dónde ver el fútbol Lloret` / `voetbal kijken Lloret` / `où regarder le foot Lloret`
4. `British pub / British bar Lloret de Mar` (audience fit — use subtly)
5. `terrace bar / beer garden Lloret de Mar pantalla gigante` (USP, uncontested)
6. `Lloret de Mar nightlife` / `best bars Lloret de Mar` (volume)

Demand signal: the "Lloret de Mar Holiday Group" on Facebook gets near-verbatim posts constantly —
*"sports bar please showing football"*, *"where to watch World Cup with family in Lloret?"* — exactly our intent.

## Competitors (who to beat)
| Venue | Known for | Rating (TA) | Real website? | Notes |
|---|---|---|---|---|
| **Piccadilly Sports Bar** | tapas + sports, beachfront | 4.5 / ~258 (#24) | ✅ piccadillysportsbar.com | Term leader — website + reviews combo. The one to beat for the head term. |
| **Masia 1952 / "Champions"** | "18 screens", rooftop, XXL cocktails, karaoke | listing exists, top reviews negative | ✅ masia1952.com | Marketing machine on IG; reputation weak spot. |
| **Route 66** | American diner/bar | 4.4 / ~382 (#23) | ✗ / weak | Highest review **count** locally; broad appeal. |
| **El Pub Lloret** | family British pub, Fenals, "all sports" | strong | ✗ Facebook only | #1 word-of-mouth for "football with family"; invisible on search. |
| **The Nags Head** | authentic British pub | solid | ✗ Facebook only | SEO-weak. |
| **Touch Down** | newer American sports bar | thin | ✗ | Direct positional rival, not established. |
| **Cafe Tyrol** | — | — | — | Ranks for ES "ver fútbol" specifically. |

**Queen Vic today:** Google 4.3/469, TripAdvisor 4.1/116 — below Piccadilly (4.5/258) & Route 66 (4.4/382)
on TA. Instagram only ~2k followers (Masia far ahead). Facebook strong (~9.5k likes).

## What's already shipped in-repo (done)
- Localized, keyworded titles/meta on Home, Sports Bar, What's On (5 languages).
- New evergreen hub **/watch-football** ("where to watch football in Lloret de Mar") linking the WC hub +
  every /watch/:competition page; in sitemap (×5) + llms.txt.
- Expanded llms.txt Q&A: sports bar / British & Irish / beer-garden terrace / dónde ver el fútbol (EN/ES/FR/NL).
- 3 new FAQ entries (where to watch football / British bar / outdoor terrace) → also feed FAQPage JSON-LD.
- **Google review CTA** (write-review deep link) on the booking success screen + FAQ.
- More indexable World Cup nations (added Belgium, Italy, USA, Morocco, Mexico).
- Already in place from earlier: BarOrPub + SportsEvent + Event + FAQPage + Breadcrumb JSON-LD, hreflang ×5,
  dynamic sitemap, robots.txt with AI-bot allowlist, Google rating in schema.

## 3. Off-repo actions for the owner (I cannot do these)
Ranked by ROI:
1. **Review-generation campaign (highest ROI).** Close the gap vs Piccadilly/Route 66.
   - QR codes on tables / receipts / the terrace screen pointing to the write-review link:
     `https://search.google.com/local/writereview?placeid=ChIJb3lcLjwXuxIRnzWKkMG6HGs`
   - Ask after the final whistle / when the bill lands. Aim for a steady trickle, not a spike.
2. **Directory + citation coverage** (these aggregators already rank for our terms):
   - **FANZO** (fanzo.com — "find live sport near you" directory): claim/add the venue + fixtures.
   - **Yelp** (already on the nightlife list): complete the profile.
   - **clubvillamar "25 best pubs in Lloret"** (exists in EN/ES/FR/NL): request inclusion.
   - **lloretdemar.org** (official tourism): get listed.
   - **TripAdvisor**: claim/optimize, post World Cup 2026 updates.
   - Keep **NAP identical** everywhere (name, address, phone) — feeds the Google Business Profile.
3. **Google Business Profile:** category "Sports bar"; weekly World Cup posts; lots of terrace/screen photos;
   keep hours accurate (the FB page once showed "temporarily closed" — make sure GBP never does).
4. **Instagram cadence:** match Masia's World Cup countdown reels — but also publish the same as site pages so
   it works for search, not just social. Grow from ~2k.

## Maintenance
- Refresh `shared/venue.ts` `ratingGoogle` / `rating` figures periodically (they drift).
- After the World Cup, prune finished fixtures (sitemap already excludes played matches) and consider
  trimming `INDEXABLE_TEAMS` back to the core audience nations to avoid thin pages.
