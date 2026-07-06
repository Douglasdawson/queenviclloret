import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { formatInTimeZone } from "date-fns-tz";
import { ButtonLink, Container, Eyebrow, FaqList, Section } from "../components/ui";
import { WhatsAppCta } from "../components/WhatsAppCta";
import { FixtureTicket, groupByDay } from "../components/FixtureTicket";
import { usePublicEvents } from "../hooks/usePublicEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, breadcrumbLd, faqLd } from "../seo/jsonld";
import { competitionFromSlug, eventMatchesCompetition } from "@shared/competitions";

const TZ = "Europe/Madrid";

export default function WatchSportPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const params = useParams();
  const slug = params.competitionSlug ?? "";
  const comp = competitionFromSlug(slug);
  const name = comp?.name ?? "";
  const path = `/watch/${slug}`;

  const { data: events } = usePublicEvents();
  const fixtures = (events ?? []).filter((e) => (comp ? eventMatchesCompetition(comp, e) : false));

  const faq = comp
    ? [
        { q: t("watchSport.faq.0.q", { competition: name }), a: t("watchSport.faq.0.a", { competition: name }) },
        { q: t("watchSport.faq.1.q", { competition: name }), a: t("watchSport.faq.1.a", { competition: name }) },
        { q: t("watchSport.faq.2.q", { competition: name }), a: t("watchSport.faq.2.a", { competition: name }) },
      ]
    : [];

  usePageSeo(
    comp
      ? {
          title: t("watchSport.metaTitle", { competition: name }),
          description: t("watchSport.metaDescription", { competition: name }),
          path,
          jsonLd: [
            barOrPubLd(siteUrl),
            breadcrumbLd(siteUrl, locale, [
              { name: t("nav.home"), path: "/" },
              { name: t("watchSport.crumb"), path: "/sports-bar" },
              { name, path },
            ]),
            faqLd(faq),
          ],
        }
      : { title: `${t("watchSport.notFoundTitle")} | Queen Vic`, path, robots: "noindex, follow" },
  );

  if (!comp) {
    return (
      <Section surface="green" className="py-24 sm:py-32">
        <Container>
          <Eyebrow onGreen>{t("watchSport.crumb")}</Eyebrow>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {t("watchSport.notFoundTitle")}
          </h1>
          <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-paper-dim">
            {t("watchSport.notFoundBody")}
          </p>
          <ButtonLink href="/sports-bar" className="mt-8">
            {t("watchSport.backToSports")}
          </ButtonLink>
        </Container>
      </Section>
    );
  }

  const days = groupByDay(fixtures);

  return (
    <Section surface="green" className="pb-20">
      <Container className="pt-16 sm:pt-24">
        <Eyebrow onGreen className="mb-0">
          {t("watchSport.eyebrow")}
        </Eyebrow>
        <h1 className="font-display display-2 mt-5 max-w-3xl font-bold">
          {t("watchSport.h1", { competition: name })}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">
          {t("watchSport.lead", { competition: name })}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppCta />
          <ButtonLink href="/whats-on" variant="outline">
            {t("cta.seeWhatsOn")}
          </ButtonLink>
        </div>
      </Container>

      {/* Upcoming fixtures for this competition */}
      <Container className="mt-14">
        <Eyebrow onGreen>{t("watchSport.scheduleSub", { competition: name })}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {t("watchSport.scheduleTitle")}
        </h2>
        {days.length === 0 ? (
          <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim">
            {t("watchSport.empty", { competition: name })}
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {days.map((g) => (
              <div key={g.key}>
                <h3 className="label-caps mb-4 text-xs text-gold-400">
                  {formatInTimeZone(new Date(g.first.startsAt), TZ, "EEEE d MMM")}
                </h3>
                <div className="grid gap-3.5 lg:grid-cols-2">
                  {g.items.map((e) => (
                    <FixtureTicket key={e.id} event={e} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* GEO Q&A for this competition */}
      <Container className="mt-16">
        <Eyebrow onGreen>{t("worldCup.faqTitle")}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {t("watchSport.faqHeading", { competition: name })}
        </h2>
        <FaqList items={faq} surface="green" className="mt-8" />
      </Container>
    </Section>
  );
}
