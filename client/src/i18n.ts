import i18next, { type i18n as I18n } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import ca from "./locales/ca/common.json";
import fr from "./locales/fr/common.json";
import nl from "./locales/nl/common.json";
import { DEFAULT_LOCALE, type Locale } from "@shared/enums";

export const resources = {
  en: { common: en },
  es: { common: es },
  ca: { common: ca },
  fr: { common: fr },
  nl: { common: nl },
} as const;

/** Create an isolated i18next instance for a given locale (one per SSR request). */
export function createI18n(lng: Locale = DEFAULT_LOCALE): I18n {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: DEFAULT_LOCALE,
    resources,
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}
