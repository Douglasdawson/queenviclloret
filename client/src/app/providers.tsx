import type { ReactNode } from "react";
import { Router } from "wouter";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import type { i18n as I18n } from "i18next";
import { SeoProvider } from "../seo/seo-context";
import { ReservationModalProvider } from "./reservation-modal";
import type { SeoCollector } from "../seo/types";
import { SiteContext } from "./site-context";
import { DEFAULT_LOCALE, type Locale } from "../lib/locale";

export interface ProvidersProps {
  children: ReactNode;
  queryClient: QueryClient;
  i18n: I18n;
  seoCollector: SeoCollector;
  base: string;
  siteUrl: string;
  locale?: Locale;
  /** Full path for SSR; omit on the client (uses window.location). */
  ssrPath?: string;
}

export function AppProviders({
  children,
  queryClient,
  i18n,
  seoCollector,
  base,
  siteUrl,
  locale = DEFAULT_LOCALE,
  ssrPath,
}: ProvidersProps) {
  return (
    <SiteContext.Provider value={{ siteUrl, locale }}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <SeoProvider collector={seoCollector}>
            <ReservationModalProvider>
              <Router base={base} ssrPath={ssrPath}>
                {children}
              </Router>
            </ReservationModalProvider>
          </SeoProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </SiteContext.Provider>
  );
}
