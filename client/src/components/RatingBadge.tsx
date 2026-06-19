import { useTranslation } from "react-i18next";
import { VENUE } from "@shared/venue";

/**
 * Visible aggregate ratings, sourced from VENUE (the same Google numbers the
 * BarOrPub JSON-LD emits). Google requires the rating shown to users to match
 * the structured data, so this keeps the schema policy-compliant. TripAdvisor
 * is shown alongside it.
 */
function Source({
  value,
  count,
  url,
  source,
  onGreen,
}: {
  value: number;
  count: number;
  url: string;
  source: string;
  onGreen: boolean;
}) {
  const { t } = useTranslation();
  const dim = onGreen ? "text-paper-dim" : "text-ink-600";
  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={t("reviews.aria", { value, count, source })}
      className={`group inline-flex items-center gap-1.5 text-sm ${dim} transition-colors hover:text-gold-500`}
    >
      <span aria-hidden="true" className="text-gold-400">
        ★
      </span>
      <span className={onGreen ? "font-semibold text-paper" : "font-semibold text-ink-900"}>
        {value.toFixed(1)}
      </span>
      <span className="underline-offset-4 group-hover:underline">
        {t("reviews.count", { count, source })}
      </span>
    </a>
  );
}

export function RatingBadge({
  onGreen = false,
  className = "",
}: {
  onGreen?: boolean;
  className?: string;
}) {
  const sep = onGreen ? "text-paper-dim/40" : "text-ink-600/40";
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      <Source
        value={VENUE.ratingGoogle.value}
        count={VENUE.ratingGoogle.count}
        url={VENUE.ratingGoogle.url}
        source="Google"
        onGreen={onGreen}
      />
      <span aria-hidden="true" className={sep}>
        ·
      </span>
      <Source
        value={VENUE.rating.value}
        count={VENUE.rating.count}
        url={VENUE.rating.url}
        source="Tripadvisor"
        onGreen={onGreen}
      />
    </div>
  );
}
