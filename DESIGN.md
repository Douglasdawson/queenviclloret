# DESIGN.md — Queen Vic "Heritage Audaz"

Direction: **bold heritage**. British pub heritage executed with Mediterranean summer energy. Bottle green is the brand surface; gold is the signal; cream is the paper; charcoal is the ink. The Victoria stamp and the laurel are the signature devices. Photography (real terrace at dusk, festoon lights) carries the atmosphere.

## Color (OKLCH, tinted neutrals — never #000/#fff)

Strategy: **Committed**. Bottle green carries 30–60% of key surfaces (header, heroes, What's On board, footer). Cream sections breathe between green blocks. Gold is reserved for CTAs, times, and heritage devices.

- `green-950` oklch(0.22 0.04 165) — deepest surface (footer, dusk sections)
- `green-900` oklch(0.27 0.05 163) — primary brand surface
- `green-800` oklch(0.33 0.055 162)
- `green-700` oklch(0.40 0.06 160) — borders on green
- `gold-500` oklch(0.75 0.13 90) ≈ #C9A84C — brand gold (CTAs, accents)
- `gold-400` oklch(0.82 0.12 92) — hover/highlight gold
- `gold-600` oklch(0.66 0.12 88) — gold on cream (AA text-large)
- `cream-50` oklch(0.97 0.012 90) — paper background
- `cream-100` oklch(0.945 0.018 88) ≈ #F3EEE5 — tinted paper
- `cream-200` oklch(0.90 0.025 87) — paper borders
- `ink-900` oklch(0.25 0.015 160) — charcoal text (green-tinted)
- `ink-600` oklch(0.45 0.015 160) — secondary text on cream
- `cream-on-green` oklch(0.95 0.02 90) — text on green surfaces
- `dusk-400` oklch(0.72 0.11 45) — warm festoon amber (sparingly: glows, live dots)

Contrast guardrails: body text on cream uses ink-900/ink-600; on green uses cream-on-green; gold never below 18px text on cream unless gold-600.

## Typography (self-hosted, no Google CDN)

Voice words: warm, weathered, convivial (a hand-painted 1986 terrace sign; a matchday programme). Reflex picks (Inter, DM Sans, Space Grotesk) rejected per the reflex-reject list.

- **One committed family**: `Bricolage Grotesque Variable` (@fontsource-variable/bricolage-grotesque) for display AND body, leaning on its optical sizing + wide weight range (200–800). Single-family with strong weight/size contrast over a timid display+body pair.
- Display: weights 600–800, tight (-0.02em), `text-wrap: balance`, fluid clamp (bounded ≤2.5× min). Sentence case; caps only for short ticket/label text with +0.06em tracking.
- Body: 16–18px equivalent (1rem/1.0625rem), weight 400–500, 65–75ch, `font-optical-sizing: auto`.
- Fallback stack: system-ui (size-adjusted). `font-display: swap`, preload the variable file.
- **Script**: the logo image only. Never set UI text in script.
- Scale: 1.333 ratio, 5 sizes max. Tabular numbers (`font-variant-numeric: tabular-nums`) on fixture times.

## Signature devices

- **Stamp frame**: perforated postage-stamp border (CSS radial-gradient mask dots) around the Victoria stamp photo and select framed content.
- **Laurel seal**: the 40 · Est. 1986 mark used as a quiet badge, not a hero metric.
- **Match programme ticket**: fixtures rendered as tickets — left column time block (gold on green), dashed perforation divider, competition + matchup, commentary-language tag. No identical card grids.
- **Festoon glow**: subtle radial warm glows over green dusk sections (background, not blur/glass).
- **Floating panels**: the cream is the page paper; every green/deep surface (heroes, What's On
  blocks, CTA bands, footer) floats on it as a rounded panel (28px radius mobile / 40px desktop,
  `mx-2 sm:mx-4` gutters). Same cut-paper logic as the stamp and tickets — nothing full-bleed
  rectangular except the cream itself.
- **Bunting rule**: at most one decorative flourish per viewport.

## Components

- Buttons: gold fill, ink text, slightly rounded (10px), firm hover (darken + 1px lift); secondary = cream/green outline. No pill-everything.
- Inputs on cream: cream-100 fill, cream-200 border, ink text, gold focus ring.
- Sections: cream paper default; green blocks for hero/What's On/footer render as floating
  rounded panels (see Floating panels device); vary padding rhythm (not uniform py-24).
- Header: floating green pill card (rounded-2xl, sticky with a top gap, solid — no glass),
  full panel width; mobile menu folds inside the same card.
- Motion: ease-out-quart/expo 150–350ms; transform/opacity only; `prefers-reduced-motion` respected everywhere.

## Theme scene

A tourist on a sunlounger at 4pm squinting at his phone in full Mediterranean sun, then the same person at 9pm on the terrace under festoon lights. The site must read in glare (cream base, strong ink contrast) and feel like the terrace at dusk in its green/gold moments. Light-first with deep green immersive blocks; not a dark theme.

## Bans (inherit impeccable's absolute bans)

Side-stripe borders, gradient text, glassmorphism, hero-metric template, identical card grids, modal-first, em dashes in copy. Plus: no neon, no lightning bolts, no Bebas-style condensed all-caps walls, no animated counters from zero.
