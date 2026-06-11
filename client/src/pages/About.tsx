import { useTranslation } from "react-i18next";
import { Container, Kicker, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";

export default function AboutPage() {
  const { t } = useTranslation();
  usePageSeo({
    title: "40 Years in Lloret de Mar — About Queen Vic Sports Bar",
    description:
      "Since 1986, Queen Vic has been where sport fans meet on the Costa Brava. 40 years of sport, sun and good times in Lloret de Mar.",
    path: "/about",
  });

  return (
    <Section className="pt-16">
      <Container>
        <Kicker>Est. 1986 · Class of Lloret</Kicker>
        <h1 className="max-w-3xl font-display text-4xl font-extrabold sm:text-5xl">
          Celebrating 40 Years in Lloret de Mar
        </h1>
        <div className="mt-6 max-w-2xl space-y-4 text-ink-soft">
          <p>
            Since 1986, Queen Vic has been the place where sport fans meet, memories are made and
            good times never stop. The original sports bar in Lloret de Mar.
          </p>
          <p>
            A huge 1,250 m² terrace, a giant outdoor screen for the big match days, 15+ screens in
            total and a resident DJ every night. Watch the sport, then stay for the night.
          </p>
          <p>{t("tagline")}.</p>
        </div>
      </Container>
    </Section>
  );
}
