// Slug + team helpers shared by the client (World Cup pages) and the server
// (sitemap), so match/team slugs are byte-identical on both sides.
// `slugify` mirrors server/lib/slug.ts exactly — keep the two in sync.

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** A national team's URL slug, e.g. "Côte d'Ivoire" → "cote-d-ivoire". */
export function teamSlug(team: string): string {
  return slugify(team);
}

/**
 * National teams we publish indexable "watch X in Lloret" pages for: the site's
 * five audience languages (England, Spain, Netherlands, France, Ireland) plus
 * tournament favourites. Every other team still renders a working page (so
 * internal links never break), but is kept out of the index to avoid thin /
 * duplicate pages diluting crawl budget mid-tournament.
 */
export const INDEXABLE_TEAMS = [
  "England",
  "Spain",
  "Netherlands",
  "France",
  "Ireland",
  "Brazil",
  "Argentina",
  "Portugal",
  "Germany",
] as const;

const INDEXABLE_SLUGS = new Set(INDEXABLE_TEAMS.map(teamSlug));

export function isIndexableTeam(team: string): boolean {
  return INDEXABLE_SLUGS.has(teamSlug(team));
}
