import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { formatInTimeZone } from "date-fns-tz";
import { ButtonLink, Chip, Container, Eyebrow, FaqList, Section } from "../components/ui";
import { WhatsAppCta } from "../components/WhatsAppCta";
import { FixtureTicket } from "../components/FixtureTicket";
import { useWorldCupEvents } from "../hooks/useWorldCupEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, breadcrumbLd, faqLd, matchEventLd } from "../seo/jsonld";
import { teamSlug } from "../lib/wc-teams";

const TZ = "Europe/Madrid";

export default function WorldCupMatchPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const params = useParams();
  const matchSlug = params.matchSlug ?? "";

  const { data: wcEvents } = useWorldCupEvents();
  const fixtures = wcEvents ?? [];
  const match = fixtures.find((e) => e.slug === matchSlug);

  const home = match?.homeTeam ?? "";
  const away = match?.awayTeam ?? "";
  const path = `/world-cup-2026/${matchSlug}`;

  // "Finished" → keep crawlable for "what was the score" queries, but out of the index.
  const startMs = match ? new Date(match.startsAt).getTime() : 0;
  const finished =
    match != null &&
    (match.status === "finished" ||
      match.scoreStatus === "FT" ||
      startMs < Date.now() - 3 * 3600_000);

  const dateLabel = match ? formatInTimeZone(new Date(match.startsAt), TZ, "EEEE d MMMM") : "";
  const timeLabel = match ? formatInTimeZone(new Date(match.startsAt), TZ, "HH:mm") : "";
  const commentary = match ? t(`fixture.commentary.${match.commentaryLang}`) : "";

  const faq = match
    ? [
        { q: t("wcMatch.faq.0.q", { home, away }), a: t("wcMatch.faq.0.a", { home, away }) },
        {
          q: t("wcMatch.faq.1.q", { home, away }),
          a: t("wcMatch.faq.1.a", { home, away, date: dateLabel, time: timeLabel, commentary }),
        },
        { q: t("wcMatch.faq.2.q", { home, away }), a: t("wcMatch.faq.2.a", { home, away }) },
      ]
    : [];

  usePageSeo(
    match
      ? {
          title: t("wcMatch.metaTitle", { home, away }),
          description: t("wcMatch.metaDescription", { home, away }),
          path,
          jsonLd: [
            barOrPubLd(siteUrl),
            matchEventLd(siteUrl, locale, {
              home,
              away,
              startsAt: match.startsAt,
              endsAt: match.endsAt,
              slug: match.slug,
            }),
            breadcrumbLd(siteUrl, locale, [
              { name: t("nav.home"), path: "/" },
              { name: t("nav.worldCup"), path: "/world-cup-2026" },
              { name: `${home} v ${away}`, path },
            ]),
            faqLd(faq),
          ],
          ...(finished ? { robots: "noindex, follow" } : {}),
        }
      : { title: `${t("wcMatch.notFoundTitle")} | Queen Vic`, path, robots: "noindex, follow" },
  );

  if (!match) {
    return (
      <Section surface="green" className="py-24 sm:py-32">
        <Container>
          <Eyebrow onGreen>{t("worldCup.facts")}</Eyebrow>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {t("wcMatch.notFoundTitle")}
          </h1>
          <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-paper-dim">
            {t("wcMatch.notFoundBody")}
          </p>
          <ButtonLink href="/world-cup-2026" className="mt-8">
            {t("wcMatch.backToHub")}
          </ButtonLink>
        </Container>
      </Section>
    );
  }

  const sameDayKey = formatInTimeZone(new Date(match.startsAt), TZ, "yyyy-MM-dd");
  const otherToday = fixtures.filter(
    (e) =>
      e.id !== match.id &&
      formatInTimeZone(new Date(e.startsAt), TZ, "yyyy-MM-dd") === sameDayKey,
  );

  return (
    <Section surface="green" className="pb-20">
      {/* Hero — the literal query as an H1 */}
      <Container className="pt-16 sm:pt-24">
        <Eyebrow onGreen className="mb-0">
          {t("wcMatch.eyebrow")}
        </Eyebrow>
        <h1 className="font-display display-2 mt-5 max-w-3xl font-bold">
          {t("wcMatch.h1", { home, away })}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">
          {t("wcMatch.lead", { home, away })}
        </p>
        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-gold-400">
          {t("wcMatch.kickoff", { date: dateLabel, time: timeLabel, commentary })}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppCta />
          <ButtonLink href="/world-cup-2026" variant="outline">
            {t("wcMatch.backToHub")}
          </ButtonLink>
        </div>
      </Container>

      {/* The fixture itself — live score once it kicks off */}
      <Container className="mt-12">
        <div className="max-w-xl">
          <FixtureTicket event={match} />
        </div>
      </Container>

      {/* Follow either nation */}
      <Container className="mt-12">
        <Eyebrow onGreen>{t("wcMatch.followSub")}</Eyebrow>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {[home, away].filter(Boolean).map((team) => (
            <Chip key={team} href={`/world-cup-2026/team/${teamSlug(team)}`}>
              {t("wcMatch.followTeam", { team })}
            </Chip>
          ))}
        </div>
      </Container>

      {/* Other matches the same day */}
      {otherToday.length > 0 && (
        <Container className="mt-14">
          <Eyebrow onGreen>{t("wcMatch.otherTodaySub")}</Eyebrow>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {t("wcMatch.otherToday")}
          </h2>
          <div className="mt-6 grid gap-3.5 lg:grid-cols-2">
            {otherToday.map((e) => (
              <FixtureTicket key={e.id} event={e} href={`/world-cup-2026/${e.slug}`} />
            ))}
          </div>
        </Container>
      )}

      {/* GEO Q&A for this fixture */}
      <Container className="mt-16">
        <Eyebrow onGreen>{t("worldCup.faqTitle")}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {t("wcMatch.faqHeading", { home, away })}
        </h2>
        <FaqList items={faq} surface="green" className="mt-8" />
      </Container>
    </Section>
  );
}
