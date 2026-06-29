import { describe, it, expect } from "vitest";
import { detectBot } from "./bots";

const UA = {
  gptbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot",
  chatgptUser: "Mozilla/5.0 (compatible) ChatGPT-User/1.0; +https://openai.com/bot",
  oaiSearch: "Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)",
  perplexityBot: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  perplexityUser: "Mozilla/5.0 Perplexity-User/1.0; +https://perplexity.ai/perplexity-user",
  claudeBot: "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  claudeUser: "Mozilla/5.0 Claude-User/1.0; +Claude-User@anthropic.com",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  chrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
};

describe("detectBot", () => {
  it("classifies AI live-retrieval bots as ai-search", () => {
    expect(detectBot(UA.chatgptUser)).toMatchObject({ name: "ChatGPT-User", category: "ai-search" });
    expect(detectBot(UA.oaiSearch)).toMatchObject({ name: "OAI-SearchBot", category: "ai-search" });
    expect(detectBot(UA.claudeUser)).toMatchObject({ name: "Claude-User", category: "ai-search" });
  });

  it("classifies AI training crawlers as ai-training", () => {
    expect(detectBot(UA.gptbot)).toMatchObject({ name: "GPTBot", category: "ai-training" });
    expect(detectBot(UA.claudeBot)).toMatchObject({ name: "ClaudeBot", category: "ai-training" });
  });

  it("classifies classic search engines as search", () => {
    expect(detectBot(UA.googlebot)).toMatchObject({ name: "Googlebot", category: "search" });
    expect(detectBot(UA.bingbot)).toMatchObject({ name: "Bingbot", category: "search" });
  });

  it("prefers the more specific token (Perplexity-User over PerplexityBot)", () => {
    expect(detectBot(UA.perplexityUser)?.name).toBe("Perplexity-User");
    expect(detectBot(UA.perplexityBot)?.name).toBe("PerplexityBot");
  });

  it("returns null for human browsers and empty input", () => {
    expect(detectBot(UA.chrome)).toBeNull();
    expect(detectBot("")).toBeNull();
    expect(detectBot(undefined)).toBeNull();
    expect(detectBot(null)).toBeNull();
  });
});
