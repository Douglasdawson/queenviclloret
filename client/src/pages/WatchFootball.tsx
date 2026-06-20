import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ButtonLink, Container, Eyebrow, FaqList, Section } from "../components/ui";
import { ReserveButton } from "../components/ReserveButton";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, breadcrumbLd, faqLd } from "../seo/jsonld";
import { COMPETITIONS } from "@shared/competitions";

/** Evergreen hub targeting "where to watch football in Lloret de Mar" (+ ES/CA/FR/NL).
 *  Internally links the World Cup hub and every /watch/:competition page. */
export default function WatchFootballPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const path = "/watch-football";

  const faq = [
    { q: t("watchFootball.faq.0.q"), a: t("watchFootball.faq.0.a") },
    { q: t("watchFootball.faq.1.q"), a: t("watchFootball.faq.1.a") },
    { q: t("watchFootball.faq.2.q"), a: t("watchFootball.faq.2.a") },
  ];

  usePageSeo({
    title: t("watchFootball.metaTitle"),
    description: t("watchFootball.metaDescription"),
    path,
    jsonLd: [
      barOrPubLd(siteUrl),
      breadcrumbLd(siteUrl, locale, [
        { name: t("nav.home"), path: "/" },
        { name: t("watchFootball.crumb"), path },
      ]),
      faqLd(faq),
    ],
  });

  // Hub links: World Cup first, then the evergreen per-competition pages.
  const links = [
    { label: "World Cup 2026", href: "/world-cup-2026" },
    ...COMPETITIONS.map((c) => ({ label: c.name, href: `/watch/${c.slug}` })),
  ];

  return (
    <Section surface="green" className="pb-20">
      <Container className="pt-16 sm:pt-24">
        <Eyebrow onGreen className="mb-0">
          {t("watchFootball.eyebrow")}
        </Eyebrow>
        <h1 className="font-display display-2 mt-5 max-w-3xl font-bold">{t("watchFootball.h1")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">
          {t("watchFootball.lead")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ReserveButton />
          <ButtonLink href="/whats-on" variant="outline">
            {t("cta.seeWhatsOn")}
          </ButtonLink>
        </div>
      </Container>

      {/* Competition hub */}
      <Container className="mt-14">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {t("watchFootball.compsTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-paper-dim">
          {t("watchFootball.compsBody")}
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex min-h-11 items-center rounded-full border border-green-700 px-5 text-sm font-medium text-paper transition-colors duration-200 hover:border-gold-400 hover:text-gold-400"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* GEO Q&A */}
      <Container className="mt-16">
        <Eyebrow onGreen>{t("worldCup.faqTitle")}</Eyebrow>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("watchFootball.h1")}</h2>
        <FaqList items={faq} surface="green" className="mt-8" />
      </Container>
    </Section>
  );
}
