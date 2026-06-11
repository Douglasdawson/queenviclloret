import { useLocation } from "wouter";
import { LOCALES, type Locale } from "../lib/locale";

const LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  ca: "CA",
  fr: "FR",
  nl: "NL",
};

/**
 * Switches language with a full navigation (not client-side) so each locale is
 * served fresh by SSR — best for SEO and avoids router base churn.
 */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const [location] = useLocation(); // path relative to base (/<locale>)
  const rest = location === "/" ? "" : location;

  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {LOCALES.map((l) => (
        <a
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className={
            l === current
              ? "rounded px-2 py-1 text-gold-400"
              : "rounded px-2 py-1 text-ink-soft hover:text-ink"
          }
        >
          {LABELS[l]}
        </a>
      ))}
    </div>
  );
}
