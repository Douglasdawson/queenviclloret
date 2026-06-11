import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatInTimeZone } from "date-fns-tz";
import { cn } from "../lib/cn";
import type { PublicEvent } from "../lib/types";

const TZ = "Europe/Madrid";

// Competition/commentary fall back to i18n keys (fixture.sport.*, fixture.commentary.*).

/**
 * Live = admin-set status (SSR-stable) or, after mount, the clock says so.
 * The clock check runs client-side only to keep server and client HTML identical.
 */
function useIsLive(e: PublicEvent): boolean {
  const [clockLive, setClockLive] = useState(false);
  useEffect(() => {
    const start = new Date(e.startsAt).getTime();
    const end = e.endsAt ? new Date(e.endsAt).getTime() : start + 2.5 * 3600_000;
    const now = Date.now();
    setClockLive(now >= start && now <= end);
  }, [e.startsAt, e.endsAt]);
  return e.status === "live" || clockLive;
}

/**
 * A fixture as a matchday-programme ticket: gold time stub on green, dashed
 * perforation, then the matchup. Featured fixtures get the gold edge.
 */
export function FixtureTicket({ event }: { event: PublicEvent }) {
  const { t } = useTranslation();
  const live = useIsLive(event);
  const matchup =
    event.homeTeam && event.awayTeam ? `${event.homeTeam} v ${event.awayTeam}` : event.title;
  // Normalize: server gets Date objects from the DAO, client gets ISO strings
  // from the dehydrated state. Render the same ISO on both to avoid mismatch.
  const startsIso = new Date(event.startsAt).toISOString();
  const time = formatInTimeZone(new Date(event.startsAt), TZ, "HH:mm");

  return (
    <article
      className={cn(
        "group flex overflow-hidden rounded-xl border bg-green-800/70 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_oklch(0.15_0.03_165/0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        event.isFeatured ? "border-gold-500/70" : "border-green-700 hover:border-green-600",
      )}
    >
      {/* Time stub */}
      <div className="flex w-[5.25rem] shrink-0 flex-col items-center justify-center gap-1 bg-green-950/60 px-2 py-4">
        <time dateTime={startsIso} className="tnum font-display text-2xl font-bold text-gold-400">
          {time}
        </time>
        {live ? (
          <span className="flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-wider text-dusk-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dusk-400 motion-reduce:animate-none" aria-hidden="true" />
            {t("whatsOn.live")}
          </span>
        ) : (
          <span className="label-caps text-[0.625rem] text-paper-dim/70">
            {formatInTimeZone(new Date(event.startsAt), TZ, "EEE d")}
          </span>
        )}
      </div>

      <div className="ticket-perf shrink-0 self-stretch" aria-hidden="true" />

      {/* Matchup */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h3 className="font-display text-[1.0625rem] font-bold leading-snug text-paper">
            {matchup}
          </h3>
          {event.isFeatured && (
            <span className="label-caps text-[0.625rem] text-gold-400">{t("whatsOn.featured")}</span>
          )}
        </div>
        <p className="truncate text-[0.8125rem] text-paper-dim">
          {[
            event.competition ?? t(`fixture.sport.${event.sport}`),
            t(`fixture.commentary.${event.commentaryLang}`),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </article>
  );
}

/** Group fixtures by Europe/Madrid calendar day, preserving order. */
export function groupByDay(events: PublicEvent[]) {
  const groups: { key: string; first: PublicEvent; items: PublicEvent[] }[] = [];
  for (const e of events) {
    const key = formatInTimeZone(new Date(e.startsAt), TZ, "yyyy-MM-dd");
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, first: e, items: [] };
      groups.push(g);
    }
    g.items.push(e);
  }
  return groups;
}
