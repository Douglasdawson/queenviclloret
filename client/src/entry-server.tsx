import { renderToString } from "react-dom/server";
import { dehydrate } from "@tanstack/react-query";
import { AppProviders } from "./app/providers";
import { resolveRoot } from "./app/root";
import { createI18n } from "./i18n";
import { makeQueryClient, queryKeys } from "./lib/query";
import { renderHeadTags } from "./seo/render-head";
import type { SeoCollector } from "./seo/types";
import { DEFAULT_LOCALE, type Locale } from "@shared/enums";

export interface RenderContext {
  lang: Locale;
  siteUrl: string;
  initialData: Record<string, unknown>;
}

export async function render(url: string, ctx: RenderContext) {
  const pathname = url.split("?")[0];
  const { base, element, locale } = resolveRoot(pathname);

  const queryClient = makeQueryClient();
  if (ctx.initialData?.events) {
    queryClient.setQueryData(queryKeys.publicEvents, ctx.initialData.events);
  }
  if (ctx.initialData?.worldCup) {
    queryClient.setQueryData(queryKeys.worldCup, ctx.initialData.worldCup);
  }

  const i18n = createI18n(ctx.lang ?? DEFAULT_LOCALE);
  const seoCollector: SeoCollector = { isServer: true, current: null };

  const appHtml = renderToString(
    <AppProviders
      base={base}
      ssrPath={url}
      siteUrl={ctx.siteUrl}
      locale={locale}
      queryClient={queryClient}
      i18n={i18n}
      seoCollector={seoCollector}
    >
      {element}
    </AppProviders>,
  );

  const headTags = seoCollector.current ? renderHeadTags(seoCollector.current) : "";
  const dehydratedState = dehydrate(queryClient);
  return { appHtml, headTags, dehydratedState };
}
