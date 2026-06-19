import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { formatInTimeZone } from "date-fns-tz";
import { ButtonLink, Container, Eyebrow, LaurelSeal, Section } from "../components/ui";
import { FixtureTicket } from "../components/FixtureTicket";
import { Picture, imagePreload } from "../components/Picture";
import { SportsMontage } from "../components/SportsMontage";
import { usePublicEvents } from "../hooks/usePublicEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, websiteLd } from "../seo/jsonld";

const TZ = "Europe/Madrid";

export default function HomePage() {
  const { t } = useTranslation();
  const { siteUrl } = useSite();
  const { data: events } = usePublicEvents();

  // "Tonight" must mean tonight: compare calendar days in the venue timezone.
  // Server and client compute the same day except across a midnight render,
  // where React reconciles the list on hydration (acceptable edge).
  const all = events ?? [];
  const todayKey = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
  const tonight = all
    .filter((e) => formatInTimeZone(new Date(e.startsAt), TZ, "yyyy-MM-dd") === todayKey)
    .slice(0, 4);
  const nextUp = tonight.length === 0 ? all.slice(0, 2) : [];

  usePageSeo({
    title: `Queen Vic Sports Bar · Lloret de Mar | ${t("tagline")}`,
    description:
      "Watch live sport on the biggest outdoor screen in Lloret de Mar. Premier League, World Cup 2026, F1, MotoGP. 1,250 m² terrace and a resident DJ, since 1986.",
    path: "/",
    ogImage: `${siteUrl}/images/terrace-dusk-1280.webp`,
    preload: [imagePreload("terrace-dusk")],
    jsonLd: [barOrPubLd(siteUrl), websiteLd(siteUrl)],
  });

  const features = ["screen", "terrace", "dj", "since"] as const;

  return (
    <>
      {/* ── Hero: the real terrace at dusk ─────────────────────────────── */}
      <section className="relative isolate mx-2 mt-2 flex min-h-[88svh] items-end overflow-hidden rounded-[1.75rem] bg-green-950 text-paper sm:mx-4 sm:mt-3 sm:rounded-[2.5rem]">
        <Picture
          name="terrace-dusk"
          alt="Queen Vic's packed terrace at dusk in Lloret de Mar, giant screen showing the match under festoon lights"
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        {/* Green dusk scrim for legibility */}
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,oklch(0.2_0.04_165/0.92)_0%,oklch(0.2_0.04_165/0.55)_45%,oklch(0.22_0.04_165/0.25)_100%)]"
          aria-hidden="true"
        />

        <Container className="pb-14 pt-40 sm:pb-20">
          <p className="reveal label-caps mb-4 text-[0.8125rem] text-gold-400">{t("home.kicker")}</p>
          <h1 className="reveal font-display display-1 max-w-3xl font-bold">
            {t("home.heroTitle")}
          </h1>
          <p className="reveal-2 mt-5 max-w-xl text-lg leading-relaxed text-paper-dim">
            {t("home.heroSubtitle")}
          </p>
          <div className="reveal-3 mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/whats-on">{t("cta.seeWhatsOn")}</ButtonLink>
            <ButtonLink href="/reservations" variant="outline">
              {t("cta.bookTable")}
            </ButtonLink>
          </div>
          <p className="reveal-3 tnum mt-10 text-sm text-paper-dim/90">
            1,250 {t("home.stats.terrace")} · 15+ {t("home.stats.screens")} · 40{" "}
            {t("home.stats.years")}
          </p>
        </Container>
      </section>

      {/* ── Tonight at the Vic: the product, immediately ───────────────── */}
      <Section surface="green" className="relative isolate overflow-hidden py-16 sm:py-20">
        {/* Aerial sports montage — responsive diagonal broadcast-channel strips */}
        <SportsMontage />
        {/* Green scrim: deepens the edges, lets the centre breathe, keeps text legible */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,oklch(0.27_0.045_165/0.5)_0%,oklch(0.27_0.045_165/0.04)_36%,oklch(0.27_0.045_165/0.04)_64%,oklch(0.27_0.045_165/0.58)_100%)]"
          aria-hidden="true"
        />
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div>
              <Eyebrow onGreen>{t("home.tonightSub")}</Eyebrow>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("home.tonight")}</h2>
            </div>
            <Link
              href="/whats-on"
              className="label-caps text-xs text-gold-400 underline-offset-4 hover:underline"
            >
              {t("cta.fullProgramme")} →
            </Link>
          </div>

          {tonight.length > 0 ? (
            <div className="mt-8 grid gap-3.5 lg:grid-cols-2">
              {tonight.map((e) => (
                <FixtureTicket key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <>
              <div className="mt-8 flex flex-col items-start gap-4 rounded-xl border border-green-700 bg-green-900 p-6 sm:flex-row sm:items-center">
                <p className="max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim">
                  {t("home.tonightEmpty")}
                </p>
                <a
                  href="https://www.instagram.com/queenviclloret/"
                  rel="noopener noreferrer"
                  className="label-caps shrink-0 text-xs text-gold-400 underline-offset-4 hover:underline"
                >
                  @queenviclloret →
                </a>
              </div>
              {nextUp.length > 0 && (
                <div className="mt-10">
                  <h3 className="label-caps mb-4 text-xs text-paper-dim">{t("home.nextUp")}</h3>
                  <div className="grid gap-3.5 lg:grid-cols-2">
                    {nextUp.map((e) => (
                      <FixtureTicket key={e.id} event={e} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>

      {/* ── Why the Vic: asymmetric editorial spread ───────────────────── */}
      <Section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              <Picture
                name="terrace-crowd"
                alt="Full terrace at Queen Vic under sail shades, crowd watching the giant screen"
                sizes="(min-width:1024px) 50vw, 100vw"
                className="overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem]"
              />
            </div>
            <div className="order-1 lg:order-2">
              <Eyebrow>{t("home.whyTitle")}</Eyebrow>
              <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
                {t("home.whySubtitle")}
              </h2>
              <ol className="mt-8 space-y-6">
                {features.map((f, i) => (
                  <li key={f} className="flex gap-5">
                    <span className="tnum font-display select-none text-2xl font-bold leading-none text-gold-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink-900">
                        {t(`home.features.${f}Title`)}
                      </h3>
                      <p className="mt-1 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
                        {t(`home.features.${f}Body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Heritage band: the stamp ───────────────────────────────────── */}
      <Section className="border-t border-cream-200 bg-cream-100 py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-14">
            <div className="stamp-shadow mx-auto w-56 rotate-[-2deg] sm:w-64">
              <div className="stamp-frame">
                <Picture
                  name="victoria-stamp"
                  alt={t("home.stampAlt")}
                  sizes="256px"
                  imgClassName="rounded-sm"
                />
              </div>
            </div>
            <div>
              <Eyebrow>{t("home.heritageKicker")}</Eyebrow>
              <h2 className="font-display max-w-xl text-3xl font-bold text-ink-900 sm:text-4xl">
                {t("home.heritageTitle")}
              </h2>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
                {t("home.heritageBody")}
              </p>
              <div className="mt-8 flex items-center gap-6">
                <LaurelSeal className="w-[88px]" />
                <Link href="/about" className="label-caps text-xs text-gold-700 underline-offset-4 hover:underline">
                  {t("nav.about")} →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Final CTA band ─────────────────────────────────────────────── */}
      <Section surface="deep" className="py-16 sm:py-20">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("home.finalTitle")}</h2>
            <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-paper-dim">
              {t("home.finalBody")}
            </p>
          </div>
          <ButtonLink href="/reservations" className="shrink-0">
            {t("cta.bookTable")}
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
