import type { SeoData } from "./types";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLdScript(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

/** Serialize SeoData into <head> markup for SSR injection. */
export function renderHeadTags(data: SeoData): string {
  const tags: string[] = [];
  tags.push(`<title>${esc(data.title)}</title>`);
  if (data.description) tags.push(`<meta name="description" content="${esc(data.description)}"/>`);
  tags.push(`<meta name="robots" content="${esc(data.robots ?? "index, follow")}"/>`);
  if (data.canonical) tags.push(`<link rel="canonical" href="${esc(data.canonical)}"/>`);

  for (const alt of data.alternates ?? []) {
    tags.push(`<link rel="alternate" hreflang="${esc(alt.lang)}" href="${esc(alt.href)}"/>`);
  }

  for (const pre of data.preload ?? []) {
    const type = pre.type ? ` type="${esc(pre.type)}"` : "";
    tags.push(`<link rel="preload" href="${esc(pre.href)}" as="${esc(pre.as)}"${type}/>`);
  }

  // Open Graph / Twitter
  tags.push(`<meta property="og:title" content="${esc(data.title)}"/>`);
  if (data.description)
    tags.push(`<meta property="og:description" content="${esc(data.description)}"/>`);
  tags.push(`<meta property="og:type" content="${esc(data.ogType ?? "website")}"/>`);
  tags.push(`<meta property="og:locale" content="${esc(data.locale)}"/>`);
  if (data.canonical) tags.push(`<meta property="og:url" content="${esc(data.canonical)}"/>`);
  if (data.ogImage) tags.push(`<meta property="og:image" content="${esc(data.ogImage)}"/>`);
  tags.push(
    `<meta name="twitter:card" content="${data.ogImage ? "summary_large_image" : "summary"}"/>`,
  );

  for (const obj of data.jsonLd ?? []) tags.push(jsonLdScript(obj));

  return tags.join("\n    ");
}
