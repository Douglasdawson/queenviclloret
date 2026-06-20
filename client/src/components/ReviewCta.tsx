import { useTranslation } from "react-i18next";
import { VENUE } from "@shared/venue";

/**
 * "Leave a Google review" prompt. Closing the review-volume gap vs competitors is
 * the highest-leverage off-page lever, so we surface a direct write-review link at
 * high-intent moments (after a booking request, on the FAQ).
 */
export function ReviewCta({ onGreen = false }: { onGreen?: boolean }) {
  const { t } = useTranslation();
  const surface = onGreen
    ? "border-green-700 bg-green-900/40"
    : "border-cream-200 bg-cream-100";
  const body = onGreen ? "text-paper-dim" : "text-ink-600";
  const title = onGreen ? "text-paper" : "text-ink-900";
  return (
    <div className={`rounded-2xl border p-5 ${surface}`}>
      <p className={`font-display text-base font-bold ${title}`}>{t("reviews.askTitle")}</p>
      <p className={`mt-1 text-[0.9375rem] leading-relaxed ${body}`}>{t("reviews.askBody")}</p>
      <a
        href={VENUE.reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[10px] bg-gold-500 px-5 text-sm font-semibold text-ink-900 transition-colors hover:bg-gold-600 hover:text-cream-50"
      >
        {t("reviews.askCta")}
      </a>
    </div>
  );
}
