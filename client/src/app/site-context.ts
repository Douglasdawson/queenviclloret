import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "../lib/locale";

export interface SiteContextValue {
  siteUrl: string;
  locale: Locale;
}

export const SiteContext = createContext<SiteContextValue>({
  siteUrl: "",
  locale: DEFAULT_LOCALE,
});

export const useSite = () => useContext(SiteContext);
