/**
 * Generate app icons from the brand favicon.
 *
 * Source: client/public/favicon.svg (deep-green rounded tile + gold "QV")
 * Output (client/public/):
 *   apple-touch-icon.png      180×180  (iOS home screen)
 *   icon-192.png              192×192  (Android / manifest)
 *   icon-512.png              512×512  (manifest, splash)
 *   icon-maskable-512.png     512×512  (maskable, with safe-area padding)
 *   favicon-32.png             32×32   (PNG fallback for old crawlers)
 *
 * Run: node scripts/gen-icons.mjs
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../client/public");
const SRC = path.resolve(PUBLIC, "favicon.svg");
const GREEN = "#16261f"; // matches the favicon tile / manifest theme_color

const svg = fs.readFileSync(SRC);

/** Render the SVG at a square size onto a deep-green background (no transparency). */
async function render(size, out) {
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: GREEN })
    .flatten({ background: GREEN })
    .png()
    .toFile(path.resolve(PUBLIC, out));
  console.log("wrote", out);
}

/** Maskable: the glyph must sit inside the inner ~80% safe area, so pad it. */
async function renderMaskable(size, out) {
  const inner = Math.round(size * 0.78);
  const pad = Math.round((size - inner) / 2);
  const glyph = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: "contain", background: GREEN })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: GREEN },
  })
    .composite([{ input: glyph, top: pad, left: pad }])
    .png()
    .toFile(path.resolve(PUBLIC, out));
  console.log("wrote", out);
}

await render(180, "apple-touch-icon.png");
await render(192, "icon-192.png");
await render(512, "icon-512.png");
await render(32, "favicon-32.png");
await renderMaskable(512, "icon-maskable-512.png");
console.log("done");
