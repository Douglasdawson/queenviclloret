import { hydrateRoot } from "react-dom/client";
import { hydrate } from "@tanstack/react-query";
import "./styles.css";
import { AppProviders } from "./app/providers";
import { ClientErrorBoundary } from "./components/ClientErrorBoundary";
import { resolveRoot } from "./app/root";
import { createI18n } from "./i18n";
import { makeQueryClient } from "./lib/query";
import type { SeoCollector } from "./seo/types";
import { DEFAULT_LOCALE, type Locale } from "@shared/enums";

const lang = (window.__APP_LANG__ as Locale) ?? DEFAULT_LOCALE;
const { base, element, locale } = resolveRoot(window.location.pathname);

const queryClient = makeQueryClient();
if (window.__QUERY_STATE__) {
  hydrate(queryClient, window.__QUERY_STATE__);
}

const i18n = createI18n(lang);
const seoCollector: SeoCollector = { isServer: false, current: null };

hydrateRoot(
  document.getElementById("root")!,
  <ClientErrorBoundary>
    <AppProviders
      base={base}
      siteUrl={window.location.origin}
      locale={locale}
      queryClient={queryClient}
      i18n={i18n}
      seoCollector={seoCollector}
    >
      {element}
    </AppProviders>
  </ClientErrorBoundary>,
);
