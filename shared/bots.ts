/**
 * Crawler taxonomy + User-Agent detection, shared by the server bot-tracking
 * middleware and any client display that needs the category labels.
 *
 * NOTE — this is deliberately NOT the same list as `AI_BOTS` in server/routes/seo.ts.
 * That list is the set of bots we *welcome in robots.txt* (including robots-token-only
 * controls). This list is the set of bots we can actually *detect from a User-Agent*.
 * Two notable robots.txt tokens are intentionally absent here because they NEVER appear
 * as a UA — Google and Apple crawl with the normal Googlebot/Applebot UA and gate AI
 * training via the `Google-Extended` / `Applebot-Extended` robots tokens only:
 *   - Google-Extended  → seen on the wire as Googlebot
 *   - Applebot-Extended → seen on the wire as Applebot
 */

export type BotCategory = "ai-search" | "ai-training" | "search";

export interface BotDef {
  /** Canonical display name. */
  name: string;
  /** Case-insensitive token matched against the User-Agent. */
  token: string;
  category: BotCategory;
}

/**
 * Matched top-to-bottom; the first token found in the UA wins. Order therefore
 * matters where one token is a substring of another (e.g. "Perplexity-User"
 * before the broader "PerplexityBot"; specific AI bots before generic search).
 */
export const TRACKED_BOTS: BotDef[] = [
  // ── AI · live retrieval / answer engines (a user asked → the bot fetches to cite) ──
  { name: "ChatGPT-User", token: "ChatGPT-User", category: "ai-search" },
  { name: "OAI-SearchBot", token: "OAI-SearchBot", category: "ai-search" },
  { name: "Perplexity-User", token: "Perplexity-User", category: "ai-search" },
  { name: "PerplexityBot", token: "PerplexityBot", category: "ai-search" },
  { name: "Claude-SearchBot", token: "Claude-SearchBot", category: "ai-search" },
  { name: "Claude-User", token: "Claude-User", category: "ai-search" },
  { name: "MistralAI-User", token: "MistralAI-User", category: "ai-search" },
  { name: "Meta-ExternalFetcher", token: "Meta-ExternalFetcher", category: "ai-search" },

  // ── AI · training / dataset crawlers ──
  { name: "GPTBot", token: "GPTBot", category: "ai-training" },
  { name: "ClaudeBot", token: "ClaudeBot", category: "ai-training" },
  { name: "anthropic-ai", token: "anthropic-ai", category: "ai-training" },
  { name: "Amazonbot", token: "Amazonbot", category: "ai-training" },
  { name: "Meta-ExternalAgent", token: "Meta-ExternalAgent", category: "ai-training" },
  { name: "Bytespider", token: "Bytespider", category: "ai-training" },
  { name: "CCBot", token: "CCBot", category: "ai-training" },
  { name: "cohere-ai", token: "cohere-ai", category: "ai-training" },

  // ── Classic search engines (for contrast against the AI crawlers) ──
  { name: "Googlebot", token: "Googlebot", category: "search" },
  { name: "Bingbot", token: "bingbot", category: "search" },
  { name: "DuckDuckBot", token: "DuckDuckBot", category: "search" },
  { name: "YandexBot", token: "YandexBot", category: "search" },
  { name: "Applebot", token: "Applebot", category: "search" },
];

const LOWERED: { token: string; def: BotDef }[] = TRACKED_BOTS.map((def) => ({
  token: def.token.toLowerCase(),
  def,
}));

/** Return the matching bot definition for a User-Agent, or null if none. */
export function detectBot(userAgent: string | undefined | null): BotDef | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  for (const { token, def } of LOWERED) {
    if (ua.includes(token)) return def;
  }
  return null;
}

export const CATEGORY_LABELS: Record<BotCategory, string> = {
  "ai-search": "AI · live retrieval",
  "ai-training": "AI · training",
  search: "Search engines",
};
