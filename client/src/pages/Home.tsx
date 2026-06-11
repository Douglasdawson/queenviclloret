import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button, Container, Kicker, Section } from "../components/ui";
import { FixtureCard } from "../components/FixtureCard";
import { usePublicEvents } from "../hooks/usePublicEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd } from "../seo/jsonld";

export default function HomePage() {
  const { t } = useTranslation();
  const { siteUrl } = useSite();
  const { data: events } = usePublicEvents();

  usePageSeo({
    title: `Queen Vic Sports Bar — Lloret de Mar | ${t("tagline")}`,
    description:
      "Watch live sport on the biggest outdoor screen in Lloret de Mar. Premier League, World Cup 2026, F1, MotoGP — 1,250 m² terrace and a live DJ every night since 1986.",
    path: "/",
    jsonLd: [barOrPubLd(siteUrl)],
  });

  const features = ["screen", "terrace", "dj", "since"] as const;
  const upcoming = (events ?? []).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden pt-20">
        <Container>
          <Kicker>{t("home.kicker")}</Kicker>
          <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[0.95] text-balance sm:text-7xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">{t("home.heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/whats-on">
              <Button>{t("cta.seeWhatsOn")}</Button>
            </Link>
            <Link href="/reservations">
              <Button variant="outline">{t("cta.bookTable")}</Button>
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              { n: "1,250", l: t("home.stats.terrace") },
              { n: "15+", l: t("home.stats.screens") },
              { n: "40", l: t("home.stats.years") },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-4xl font-extrabold text-gold-400 sm:text-5xl">
                  {s.n}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-ink-soft">{s.l}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Why */}
      <Section className="border-t border-white/10">
        <Container>
          <Kicker>Built for sport. Made for nights.</Kicker>
          <h2 className="max-w-3xl font-display text-3xl font-bold sm:text-4xl">
            {t("home.whyTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">{t("home.whySubtitle")}</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f} className="rounded-2xl border border-white/10 bg-night-800/50 p-6">
                <h3 className="font-display text-lg font-bold text-electric-400">
                  {t(`home.features.${f}Title`)}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{t(`home.features.${f}Body`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* What's On */}
      <Section className="border-t border-white/10">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Kicker>{t("home.whatsOnSubtitle")}</Kicker>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("home.whatsOnTitle")}</h2>
            </div>
            <Link href="/whats-on" className="hidden sm:block">
              <Button variant="ghost">{t("cta.viewDetails")}</Button>
            </Link>
          </div>

          {upcoming.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <FixtureCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-ink-soft">{t("whatsOn.empty")}</p>
          )}
        </Container>
      </Section>
    </>
  );
}
