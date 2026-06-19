import { useTranslation } from "react-i18next";
import { VENUE } from "@shared/venue";

/**
 * Visible aggregate rating, sourced from VENUE.rating (the same numbers the
 * BarOrPub JSON-LD emits). Google requires the rating shown to users to match
 * the structured data, so this badge keeps the schema policy-compliant.
 */
export function RatingBadge({
  onGreen = false,
  className = "",
}: {
  onGreen?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const { value, count, url } = VENUE.rating;
  const dim = onGreen ? "text-paper-dim" : "text-ink-600";

  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={t("reviews.aria", { value, count })}
      className={`group inline-flex items-center gap-2 text-sm ${dim} transition-colors hover:text-gold-500 ${className}`}
    >
      <span aria-hidden="true" className="text-gold-400">
        ★★★★★
      </span>
      <span className={onGreen ? "font-semibold text-paper" : "font-semibold text-ink-900"}>
        {value.toFixed(1)}
      </span>
      <span className="underline-offset-4 group-hover:underline">
        {t("reviews.count", { count })}
      </span>
    </a>
  );
}
