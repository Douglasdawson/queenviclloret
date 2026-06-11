# Design Brief — Queen Vic public site, "Heritage Audaz" redesign

Produced by $impeccable shape. Discovery answered by PRODUCT.md, DESIGN.md and prior user decisions (heritage direction confirmed twice). Visual direction probes skipped: direction is not ambiguous, it was chosen by the user against a preview.

## 1. Feature Summary

Full visual redesign of the public marketing site (9 pages + shell) for a 40-year-old sports bar in Lloret de Mar. It must convert a sun-blinded tourist into a visitor tonight, and a UK group organiser into a reservation, while looking like Queen Vic and nothing else.

## 2. Primary User Action

See what's on tonight, then act: come down or request a table. One action per page; everything funnels to What's On and Reservations.

## 3. Design Direction

- **Color strategy**: Committed (bottle green carries header, hero overlays, What's On board, footer; cream paper between). World Cup 2026 page is allowed **Drenched** green as a campaign page.
- **Scene sentence**: a tourist on a sunlounger at 4pm squinting at a phone in full Mediterranean glare, the same person at 9pm under festoon lights. Forces: light cream base for legibility in sun, deep green immersive blocks for the dusk feeling. Not a dark theme.
- **Anchor references (named)**: ① a classic London pub façade (bottle green paint, gold-leaf lettering, hanging laurel); ② a 1980s football matchday programme (ticket stubs, fixture tables, perforations); ③ Victorian postage ephemera (the venue's own Queen Victoria stamp lightbox). Aesthetic lane: *vintage matchday programme on a Mediterranean terrace*. NOT editorial magazine, NOT neon sports bar.

## 4. Scope

Production-ready. Whole public surface (Home, Sports Bar, What's On, World Cup 2026, About, Reservations, Contact, FAQ, Legal, 404 + Header/Footer/CookieBanner). Shipped-quality interactivity. Polish until it ships (critique → audit → polish passes follow).

## 5. Layout Strategy

- **Shell**: green header strip with the real script logo; footer is the deepest green block with laurel seal + stamp motif.
- **Home**: full-bleed hero on the real dusk terrace photo (terrace-dusk), green-tinted scrim, logo-scale display headline, single gold CTA. Below: "Tonight at the Vic" fixture strip (the product, immediately); a cream "Why the Vic" section as an asymmetric editorial spread (photo left, numbered claims right, no icon cards); heritage band with the Victoria stamp framed in perforations; final CTA band.
- **What's On**: a green "programme board" — date-grouped ticket list (not a grid). Each fixture is a ticket: gold time block, dashed perforation, matchup, competition + commentary tag. Empty state designed (laurel + "follow Instagram" line).
- **World Cup 2026**: drenched green campaign page, oversized display type, World Cup mark, real crowd photo, practical info as a numbered programme list.
- **Sports Bar**: the setup explained with a big 1/4/10+ screens diagram drawn in type (not cards), terrace photo interludes.
- **About**: heritage page; timeline 1986 → 2026 as a vertical programme list, stamp photo framed, anniversary seal.
- **Forms** (Reservations/Contact): cream paper, generous rhythm, grouped fields, gold submit, success state with laurel.
- Spacing: clamp()-fluid, varied rhythm (tight fixture rows, generous heritage bands).

## 6. Key States

- Fixtures: 0 (dressed empty state), 1–3 (featured emphasis), 10+ (date grouping), live-now (dusk-amber dot).
- Forms: idle, submitting, success (laurel + message), validation errors inline, server error.
- Images: explicit dims (no CLS), AVIF/WebP via Picture, hero preloaded.
- Reduced motion: all reveals/transforms gated by `prefers-reduced-motion`.

## 7. Interaction Model

- Sticky green header, mobile menu as full green sheet (no modal feel, it's the pub door).
- Fixture tickets: hover lifts 2px with shadow firming; no scale-jumps.
- Buttons: gold fill, darken + 1px translate on hover, visible gold focus ring everywhere.
- One orchestrated entrance per page (hero stagger), nothing else auto-animates.

## 8. Content Requirements

Existing i18n keys reused; new keys for: "Tonight at the Vic", date group labels, empty-state line, heritage band copy, WC campaign copy, form success lines. All in 5 locales, validated by i18n:validate. Copy tone: cheeky pub confidence, no em dashes.

## 9. Recommended References (consulted)

spatial-design.md, typography.md, brand.md (loaded). During build: color-and-contrast.md (green/gold/cream AA), motion-design.md (entrance choreography), responsive-design.md (375→1440), ux-writing.md (forms).

## 10. Open Questions

None blocking. Resolved during build: exact perforation CSS technique; whether the header logo uses logo.webp (script) or icon + wordmark on small screens.
