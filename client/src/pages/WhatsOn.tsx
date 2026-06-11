import { useTranslation } from "react-i18next";
import { Container, Kicker, Section } from "../components/ui";
import { FixtureCard } from "../components/FixtureCard";
import { usePublicEvents } from "../hooks/usePublicEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { eventLd } from "../seo/jsonld";

export default function WhatsOnPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const { data: events } = usePublicEvents();
  const list = events ?? [];

  usePageSeo({
    title: `${t("whatsOn.title")} | Queen Vic Lloret de Mar`,
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
    <Section className="pt-16">
      <Container>
        <Kicker>{t("whatsOn.subtitle")}</Kicker>
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("whatsOn.title")}</h1>

        {list.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <FixtureCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="mt-10 max-w-xl text-ink-soft">{t("whatsOn.empty")}</p>
        )}
      </Container>
    </Section>
  );
}
