import { useTranslation } from "react-i18next";
import { useSite } from "../app/site-context";
import { formatFixture } from "../lib/format";
import { cn } from "../lib/cn";
import type { PublicEvent } from "../lib/types";

const SPORT_LABEL: Record<string, string> = {
  football: "Football",
  f1: "F1",
  motogp: "MotoGP",
  rugby_league: "Rugby League",
  gaa: "GAA",
  boxing: "Boxing",
  other: "Live",
};

export function FixtureCard({ event }: { event: PublicEvent }) {
  const { locale } = useSite();
  const { t } = useTranslation();
  const matchup =
    event.homeTeam && event.awayTeam ? `${event.homeTeam} v ${event.awayTeam}` : event.title;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-night-800/60 p-5 backdrop-blur transition-colors",
        event.isFeatured ? "border-gold-400/60" : "border-white/10 hover:border-white/20",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-electric-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-electric-400">
          {SPORT_LABEL[event.sport] ?? "Live"}
        </span>
        {event.isFeatured && (
          <span className="rounded-full bg-gold-400/15 px-2.5 py-1 text-xs font-semibold uppercase text-gold-400">
            {t("whatsOn.featured")}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg font-bold leading-tight">{matchup}</h3>
      {event.competition && <p className="mt-1 text-sm text-ink-soft">{event.competition}</p>}
      <p className="mt-3 text-sm font-medium text-ink">
        <time dateTime={event.startsAt}>{formatFixture(event.startsAt, locale)}</time>
      </p>
    </article>
  );
}
