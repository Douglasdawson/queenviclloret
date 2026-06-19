import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { formatInTimeZone } from "date-fns-tz";
import { ButtonLink, Container, Eyebrow, FaqList, Section } from "../components/ui";
import { FixtureTicket, groupByDay } from "../components/FixtureTicket";
import { useWorldCupEvents } from "../hooks/useWorldCupEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, breadcrumbLd, faqLd } from "../seo/jsonld";
import { fixturesForTeam, isIndexableTeam, teamFromSlug } from "../lib/wc-teams";

const TZ = "Europe/Madrid";

export default function WorldCupTeamPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const params = useParams();
  const teamSlugParam = params.teamSlug ?? "";

  const { data: wcEvents } = useWorldCupEvents();
  const fixtures = wcEvents ?? [];
  const team = teamFromSlug(fixtures, teamSlugParam);
  const teamFixtures = team ? fixturesForTeam(fixtures, teamSlugParam) : [];

  const path = `/world-cup-2026/team/${teamSlugParam}`;
  const indexable = team ? isIndexableTeam(team) : false;

  const faq = team
    ? [
        { q: t("wcTeam.faq.0.q", { team }), a: t("wcTeam.faq.0.a", { team }) },
        { q: t("wcTeam.faq.1.q", { team }), a: t("wcTeam.faq.1.a", { team }) },
        { q: t("wcTeam.faq.2.q", { team }), a: t("wcTeam.faq.2.a", { team }) },
      ]
    : [];

  usePageSeo(
    team
      ? {
          title: t("wcTeam.metaTitle", { team }),
          description: t("wcTeam.metaDescription", { team }),
          path,
          jsonLd: [
            barOrPubLd(siteUrl),
            breadcrumbLd(siteUrl, locale, [
              { name: t("nav.home"), path: "/" },
              { name: t("nav.worldCup"), path: "/world-cup-2026" },
              { name: team, path },
            ]),
            faqLd(faq),
          ],
          ...(indexable ? {} : { robots: "noindex, follow" }),
        }
      : { title: `${t("wcTeam.notFoundTitle")} | Queen Vic`, path, robots: "noindex, follow" },
  );

  if (!team) {
    return (
      <Section surface="green" className="py-24 sm:py-32">
        <Container>
          <Eyebrow onGreen>{t("worldCup.facts")}</Eyebrow>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {t("wcTeam.notFoundTitle")}
          </h1>
          <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-paper-dim">
            {t("wcTeam.notFoundBody")}
          </p>
          <ButtonLink href="/world-cup-2026" className="mt-8">
            {t("wcMatch.backToHub")}
          </ButtonLink>
        </Container>
      </Section>
    );
  }

  const days = groupByDay(teamFixtures);
  const next = teamFixtures.find((e) => new Date(e.startsAt).getTime() >= Date.now());

  return (
    <Section surface="green" className="pb-20">
      <Container className="pt-16 sm:pt-24">
        <Eyebrow onGreen className="mb-0">
          {t("wcTeam.eyebrow")}
        </Eyebrow>
        <h1 className="font-display display-2 mt-5 max-w-3xl font-bold">
          {t("wcTeam.h1", { team })}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">
          {t("wcTeam.lead", { team })}
        </p>
        {next && (
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-gold-400">
            {t("wcTeam.nextFixture", {
              match: `${next.homeTeam} v ${next.awayTeam}`,
              date: formatInTimeZone(new Date(next.startsAt), TZ, "EEEE d MMMM"),
              time: formatInTimeZone(new Date(next.startsAt), TZ, "HH:mm"),
            })}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/reservations">{t("cta.bookTable")}</ButtonLink>
          <ButtonLink href="/world-cup-2026" variant="outline">
            {t("wcMatch.backToHub")}
          </ButtonLink>
        </div>
      </Container>

      {/* This team's fixtures, linking to each match page */}
      <Container className="mt-14">
        <Eyebrow onGreen>{t("wcTeam.scheduleSub", { team })}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {t("wcTeam.scheduleTitle")}
        </h2>
        {days.length === 0 ? (
          <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim">
            {t("worldCup.empty")}
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
                    <FixtureTicket key={e.id} event={e} href={`/world-cup-2026/${e.slug}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* GEO Q&A for this team */}
      <Container className="mt-16">
        <Eyebrow onGreen>{t("worldCup.faqTitle")}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {t("wcTeam.faqHeading", { team })}
        </h2>
        <FaqList items={faq} surface="green" className="mt-8" />
      </Container>
    </Section>
  );
}
