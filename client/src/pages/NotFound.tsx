import { useTranslation } from "react-i18next";
import { ButtonLink, Container, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";

export default function NotFoundPage() {
  const { t } = useTranslation();
  usePageSeo({ title: "Page not found | Queen Vic", path: "/404", robots: "noindex, follow" });
  return (
    <Section surface="green" className="py-24 sm:py-32">
      <Container>
        <p className="tnum font-display text-[clamp(5rem,15vw,9rem)] font-bold leading-none text-gold-400">
          404
        </p>
        <h1 className="font-display mt-4 text-3xl font-bold">{t("notFound.title")}</h1>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-paper-dim">
          {t("notFound.body")}
        </p>
        <ButtonLink href="/" className="mt-8">
          {t("notFound.cta")}
        </ButtonLink>
      </Container>
    </Section>
  );
}
