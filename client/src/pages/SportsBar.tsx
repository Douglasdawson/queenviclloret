import { useTranslation } from "react-i18next";
import { ButtonLink, Container, Eyebrow, Section } from "../components/ui";
import { Picture } from "../components/Picture";
import { usePageSeo } from "../seo/use-page-seo";

const COMPETITIONS = [
  { src: "/images/premier-league.webp", label: "Premier League" },
  { src: "/images/world-cup-2026-white.webp", label: "World Cup 2026" },
  { src: "/images/f1.webp", label: "Formula 1" },
  { src: "/images/motogp.webp", label: "MotoGP" },
  { src: "/images/rugby-league.webp", label: "Rugby League" },
  { src: "/images/gaa.webp", label: "GAA" },
];

export default function SportsBarPage() {
  const { t } = useTranslation();
  usePageSeo({
    title: "Sports Bar in Lloret de Mar · Premier League, F1, MotoGP | Queen Vic",
    description:
      "Giant outdoor screen, 4 terrace TVs and 10 screens inside showing Premier League, Rugby League, F1, MotoGP and GAA in Lloret de Mar since 1986.",
    path: "/sports-bar",
  });

  const setup = [
    { n: "1", key: "s1" },
    { n: "4", key: "s2" },
    { n: "10+", key: "s3" },
  ] as const;

  return (
    <>
      {/* The setup: screens explained in type, not cards */}
      <Section className="py-16 sm:py-24">
        <Container>
          <Eyebrow>{t("sportsBar.kicker")}</Eyebrow>
          <h1 className="font-display max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-tight text-ink-900">
            {t("sportsBar.title")}
          </h1>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
            {t("sportsBar.intro")}
          </p>

          <dl className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {setup.map((s) => (
              <div key={s.key} className="border-t-2 border-green-900 pt-5">
                <dt className="flex items-baseline gap-3">
                  <span className="tnum font-display text-5xl font-bold leading-none text-green-900">
                    {s.n}
                  </span>
                  <span className="font-display text-lg font-bold text-ink-900">
                    {t(`sportsBar.${s.key}t`)}
                  </span>
                </dt>
                <dd className="mt-2.5 max-w-xs text-[0.9375rem] leading-relaxed text-ink-600">
                  {t(`sportsBar.${s.key}b`)}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Terrace photo interlude */}
      <Picture
        name="terrace-screen"
        alt="The giant outdoor screen seen across Queen Vic's terrace"
        sizes="100vw"
        className="block"
        imgClassName="max-h-[60vh] w-full object-cover"
      />

      {/* What we show: competition marks on green */}
      <Section surface="green" className="py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("sportsBar.showTitle")}</h2>
          <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim">
            {t("sportsBar.showSub")}
          </p>
          <ul className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {COMPETITIONS.map((c) => (
              <li key={c.label} className="flex flex-col items-center gap-3">
                <img
                  src={c.src}
                  alt={c.label}
                  width={120}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-auto object-contain opacity-90 sm:h-14"
                />
                <span className="label-caps text-[0.625rem] text-paper-dim">{c.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <ButtonLink href="/whats-on">{t("cta.seeWhatsOn")}</ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
