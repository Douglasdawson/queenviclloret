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
 * served fresh by SSR. Styled for the green header surface.
 */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const [location] = useLocation(); // path relative to base (/<locale>)
  const rest = location === "/" ? "" : location;

  return (
    <nav aria-label="Language" className="flex items-center gap-0.5 text-xs font-semibold">
      {LOCALES.map((l) => (
        <a
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className={
            l === current
              ? "rounded px-1.5 py-2 text-gold-400"
              : "rounded px-1.5 py-2 text-paper-dim/70 transition-colors hover:text-paper"
          }
        >
          {LABELS[l]}
        </a>
      ))}
    </nav>
  );
}
