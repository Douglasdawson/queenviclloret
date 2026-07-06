import { useTranslation } from "react-i18next";
import { ButtonAnchor, ButtonLink, Container, Eyebrow, LaurelSeal, Section } from "../components/ui";
import { WhatsAppCta } from "../components/WhatsAppCta";
import { FixtureTicket, groupByDay } from "../components/FixtureTicket";
import { usePublicEvents } from "../hooks/usePublicEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { eventLd } from "../seo/jsonld";
import { formatDay } from "../lib/format";

export default function WhatsOnPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const { data: events } = usePublicEvents();
  const list = events ?? [];
  const days = groupByDay(list);

  usePageSeo({
    title: t("whatsOn.metaTitle"),
    description: t("whatsOn.subtitle"),
    path: "/whats-on",
    jsonLd: list.slice(0, 25).map((e) =>
      eventLd(siteUrl, locale, {
        name: e.homeTeam && e.awayTeam ? `${e.homeTeam} v ${e.awayTeam}` : e.title,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        slug: e.slug,
        description: e.description,
      }),
    ),
  });

  return (
    <Section surface="green" className="min-h-[70svh] py-16 sm:py-20">
      <Container>
        <Eyebrow onGreen>{t("whatsOn.board")}</Eyebrow>
        <h1 className="font-display display-2 max-w-2xl font-bold">
          {t("whatsOn.title")}
        </h1>
        <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-paper-dim">
          {t("whatsOn.subtitle")}
        </p>

        {days.length > 0 ? (
          <div className="mt-12 space-y-10">
            {days.map((day) => (
              <section key={day.key} aria-label={formatDay(day.first.startsAt, locale)}>
                <h2 className="label-caps mb-4 flex items-baseline gap-3 text-sm text-gold-400">
                  {formatDay(day.first.startsAt, locale)}
                  <span className="h-px flex-1 bg-green-700" aria-hidden="true" />
                </h2>
                <div className="grid gap-3.5 lg:grid-cols-2">
                  {day.items.map((e) => (
                    <FixtureTicket key={e.id} event={e} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Dressed empty state */
          <div className="mt-16 flex max-w-lg flex-col items-start gap-5">
            <LaurelSeal className="w-[96px] opacity-80" />
            <h2 className="font-display text-2xl font-bold">{t("whatsOn.empty")}</h2>
            <p className="text-[0.9375rem] leading-relaxed text-paper-dim">{t("whatsOn.emptyNote")}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonAnchor href="https://www.instagram.com/queenviclloret/">
                Instagram →
              </ButtonAnchor>
              <ButtonLink href="/contact" variant="outline">
                {t("cta.getInTouch")}
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>

      {/* Close the decision page with the action it exists for */}
      <Container className="mt-20">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-green-700 pt-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold">{t("home.finalTitle")}</h2>
            <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-paper-dim">
              {t("home.finalBody")}
            </p>
          </div>
          <WhatsAppCta className="shrink-0" />
        </div>
      </Container>
    </Section>
  );
}
