import { useTranslation } from "react-i18next";
import { Container, Eyebrow, LaurelSeal, Section } from "../components/ui";
import { WhatsAppCta } from "../components/WhatsAppCta";
import { Picture } from "../components/Picture";
import { usePageSeo } from "../seo/use-page-seo";

export default function AboutPage() {
  const { t } = useTranslation();
  usePageSeo({
    title: "Forty years in Lloret de Mar: the Queen Vic story",
    description:
      "Queen Vic opened in 1986 and never missed a season. The story of the original sports bar on the Costa Brava: the terrace, the screen, the stamp.",
    path: "/about",
  });

  const timeline = ["tl1", "tl2", "tl3", "tl4"] as const;

  return (
    <>
      <Section className="py-16 sm:py-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_auto] lg:gap-20">
            <div>
              <Eyebrow>{t("about.kicker")}</Eyebrow>
              <h1 className="font-display display-2 max-w-2xl font-bold text-ink-900">
                {t("about.title")}
              </h1>
              <div className="mt-6 max-w-xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-600">
                <p>{t("about.p1")}</p>
                <p>{t("about.p2")}</p>
              </div>
              <LaurelSeal className="mt-10" />
            </div>

            <div className="stamp-shadow w-56 rotate-2 justify-self-center sm:w-64 lg:mt-8">
              <div className="stamp-frame">
                <Picture
                  name="victoria-stamp"
                  alt={t("home.stampAlt")}
                  sizes="256px"
                  imgClassName="rounded-sm"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Timeline as a programme list */}
      <Section surface="green" className="py-16 sm:py-22">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("about.tlTitle")}</h2>
          <ol className="mt-10 max-w-2xl space-y-0 divide-y divide-green-700">
            {timeline.map((k) => (
              <li key={k} className="flex gap-6 py-6 sm:gap-10">
                <span className="tnum font-display w-24 shrink-0 text-2xl font-bold text-gold-400">
                  {t(`about.${k}y`)}
                </span>
                <p className="text-[0.9375rem] leading-relaxed text-paper-dim">{t(`about.${k}t`)}</p>
              </li>
            ))}
          </ol>
              <div className="mt-12">
                <WhatsAppCta />
              </div>
            </div>
            <Picture
              name="night-party"
              alt="Queen Vic barman pouring a pint under the terrace neon lights at night"
              sizes="(min-width:1024px) 360px, 100vw"
              className="hidden w-[360px] overflow-hidden rounded-2xl lg:block"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
