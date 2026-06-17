import { useTranslation } from "react-i18next";
import { formatInTimeZone } from "date-fns-tz";
import { ButtonLink, Container, Eyebrow, Section } from "../components/ui";
import { Picture } from "../components/Picture";
import { FixtureTicket, groupByDay } from "../components/FixtureTicket";
import { useWorldCupEvents } from "../hooks/useWorldCupEvents";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, faqLd } from "../seo/jsonld";

const TZ = "Europe/Madrid";

export default function WorldCupPage() {
  const { t } = useTranslation();
  const { siteUrl } = useSite();
  const faq = t("worldCup.faq", { returnObjects: true }) as unknown as { q: string; a: string }[];
  usePageSeo({
    title: `${t("worldCup.title")} | Queen Vic`,
    description: t("worldCup.subtitle"),
    path: "/world-cup-2026",
    jsonLd: [barOrPubLd(siteUrl), faqLd(faq)],
  });

  const { data: wcEvents } = useWorldCupEvents();
  const fixtures = wcEvents ?? [];
  const days = groupByDay(fixtures);

  const points = ["p1", "p2", "p3", "p4"] as const;
  const tips = ["tip1", "tip2", "tip3"] as const;

  return (
    <Section surface="green" className="pb-20">
      {/* Drenched campaign opening */}
      <Container className="pt-16 sm:pt-24">
        <div className="flex items-center gap-5">
          <span className="inline-block rounded-xl bg-cream-50 p-2.5 shadow-[0_8px_20px_oklch(0.15_0.03_165/0.4)]">
            <img
              src="/images/world-cup-2026.webp"
              alt="FIFA World Cup 2026"
              width={96}
              height={84}
              decoding="async"
              className="h-14 w-auto sm:h-16"
            />
          </span>
          <Eyebrow onGreen className="mb-0">
            {t("worldCup.facts")}
          </Eyebrow>
        </div>
        <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.0]">
          {t("worldCup.title")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">
          {t("worldCup.subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/reservations">{t("cta.bookTable")}</ButtonLink>
          <ButtonLink href="/whats-on" variant="outline">
            {t("cta.seeWhatsOn")}
          </ButtonLink>
        </div>
      </Container>

      {/* Crowd photo interlude */}
      <Container className="mt-16">
        <Picture
          name="terrace-night"
          alt="World Cup night on the Queen Vic terrace, sail shades and festoon lights over a full crowd"
          sizes="(min-width:1152px) 1104px, 100vw"
          className="overflow-hidden rounded-2xl"
        />
      </Container>

      {/* Schedule & live results — unified calendar grouped by day */}
      <Container className="mt-20">
        <Eyebrow onGreen>{t("worldCup.scheduleSub")}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("worldCup.scheduleTitle")}</h2>
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
                    <FixtureTicket key={e.id} event={e} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Why here: numbered programme list, not cards */}
      <Container className="mt-16">
        <ol className="grid gap-x-14 gap-y-10 sm:grid-cols-2">
          {points.map((p, i) => (
            <li key={p} className="flex gap-5">
              <span className="tnum font-display select-none text-3xl font-bold leading-none text-gold-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">{t(`worldCup.${p}t`)}</h2>
                <p className="mt-1.5 max-w-md text-[0.9375rem] leading-relaxed text-paper-dim">
                  {t(`worldCup.${p}b`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      {/* Matchday form guide */}
      <Container className="mt-20">
        <div className="rounded-2xl border border-green-700 bg-green-950/50 p-7 sm:p-9">
          <h2 className="label-caps text-sm text-gold-400">{t("worldCup.tipsTitle")}</h2>
          <ul className="mt-5 max-w-2xl space-y-3.5">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-[0.9375rem] leading-relaxed text-paper-dim">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                {t(`worldCup.${tip}`)}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* GEO Q&A — answers the literal "where to watch the World Cup in Lloret" queries */}
      <Container className="mt-20">
        <Eyebrow onGreen>{t("worldCup.faqTitle")}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("worldCup.faqHeading")}</h2>
        <div className="mt-8 max-w-2xl divide-y divide-green-700">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-display text-lg font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="tnum select-none text-xl font-medium text-gold-400 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
