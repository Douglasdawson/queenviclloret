import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/api";
import { CATEGORY_LABELS, type BotCategory } from "@shared/bots";
import { cn } from "../../lib/cn";

interface Overview {
  days: number;
  byCategory: { category: string; hits: number }[];
  byBot: { botName: string; category: string; hits: number; lastSeen: string }[];
  topPaths: { path: string; hits: number }[];
  trend: { day: string; category: string; hits: number }[];
}

const WINDOWS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

const CATEGORY_STYLES: Record<BotCategory, string> = {
  "ai-search": "bg-gold-100 text-gold-700 border-gold-300",
  "ai-training": "bg-green-100 text-green-800 border-green-300",
  search: "bg-cream-200 text-ink-600 border-cream-300",
};

function catLabel(c: string): string {
  return CATEGORY_LABELS[c as BotCategory] ?? c;
}

export default function AdminCrawlers() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useQuery({
    queryKey: ["crawlers-overview", days],
    queryFn: () => apiGet<Overview>(`/crawlers/overview?days=${days}`),
  });

  const total = data?.byCategory.reduce((s, c) => s + c.hits, 0) ?? 0;

  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">AI &amp; Search Crawlers</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-600">
            Who is crawling the site server-side — AI answer engines (ChatGPT, Perplexity, Claude),
            training bots (GPTBot, CCBot…) and search engines. These never appear in GA4: bots don't
            run JavaScript, so this is the only place they're visible.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-cream-200 bg-cream-100 p-1">
          {WINDOWS.map((w) => (
            <button
              key={w.days}
              onClick={() => setDays(w.days)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                days === w.days
                  ? "bg-green-900 text-paper"
                  : "text-ink-600 hover:bg-cream-200",
              )}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-ink-600">Loading…</p>
      ) : !data || total === 0 ? (
        <div className="mt-10 rounded-2xl border border-cream-200 bg-cream-100 p-8 text-center">
          <p className="font-display text-lg font-semibold text-green-900">No crawler hits yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
            Once deployed, this fills as bots fetch your pages. AI crawlers can take days to discover
            a site — `robots.txt` welcomes them and `llms.txt` feeds them; this panel shows when they
            arrive.
          </p>
        </div>
      ) : (
        <>
          {/* Category summary */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Total crawls" value={total} accent />
            {(["ai-search", "ai-training", "search"] as BotCategory[]).map((cat) => (
              <SummaryCard
                key={cat}
                label={CATEGORY_LABELS[cat]}
                value={data.byCategory.find((c) => c.category === cat)?.hits ?? 0}
              />
            ))}
          </div>

          <Trend rows={data.trend} days={days} />

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Per-bot table */}
            <section>
              <h2 className="font-display text-lg font-semibold">By crawler</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-cream-200">
                <table className="w-full text-sm">
                  <thead className="bg-cream-100 text-left text-xs uppercase tracking-wider text-ink-600">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Bot</th>
                      <th className="px-4 py-2.5 font-semibold">Type</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Hits</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Last seen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {data.byBot.map((b) => (
                      <tr key={b.botName} className="bg-cream-50">
                        <td className="px-4 py-2.5 font-medium text-ink-900">{b.botName}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={cn(
                              "inline-block rounded-full border px-2 py-0.5 text-xs font-medium",
                              CATEGORY_STYLES[b.category as BotCategory] ?? "",
                            )}
                          >
                            {catLabel(b.category)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-ink-900">{b.hits}</td>
                        <td className="px-4 py-2.5 text-right text-ink-600">
                          {timeAgo(b.lastSeen)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Top paths */}
            <section>
              <h2 className="font-display text-lg font-semibold">Most-crawled pages</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-cream-200">
                <table className="w-full text-sm">
                  <thead className="bg-cream-100 text-left text-xs uppercase tracking-wider text-ink-600">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Path</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Hits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {data.topPaths.map((p) => (
                      <tr key={p.path} className="bg-cream-50">
                        <td className="max-w-0 truncate px-4 py-2.5 font-mono text-xs text-ink-900">
                          {p.path}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-ink-900">{p.hits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        accent ? "border-green-900 bg-green-900 text-paper" : "border-cream-200 bg-cream-100",
      )}
    >
      <p className={cn("text-xs uppercase tracking-widest", accent ? "text-gold-400" : "text-ink-600")}>
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-4xl font-extrabold tabular-nums",
          accent ? "text-paper" : "text-green-900",
        )}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/** Lightweight per-day stacked bar chart (no charting dependency). */
function Trend({ rows, days }: { rows: Overview["trend"]; days: number }) {
  // Bucket hits per day, totalling categories.
  const byDay = new Map<string, number>();
  for (const r of rows) byDay.set(r.day, (byDay.get(r.day) ?? 0) + r.hits);

  // Build a continuous day axis so gaps (zero-crawl days) show as empty.
  const series: { day: string; hits: number }[] = [];
  const end = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    series.push({ day: key, hits: byDay.get(key) ?? 0 });
  }
  const max = Math.max(1, ...series.map((s) => s.hits));

  return (
    <section className="mt-8 rounded-2xl border border-cream-200 bg-cream-100 p-5">
      <h2 className="font-display text-lg font-semibold">Daily crawl activity</h2>
      <div className="mt-4 flex h-32 items-end gap-px">
        {series.map((s) => (
          <div
            key={s.day}
            className="group relative flex-1 rounded-t-sm bg-green-800/80 transition-colors hover:bg-green-700"
            style={{ height: `${Math.max(2, (s.hits / max) * 100)}%` }}
            title={`${s.day}: ${s.hits} crawls`}
          />
        ))}
      </div>
    </section>
  );
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const mins = Math.round((Date.now() - then) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
