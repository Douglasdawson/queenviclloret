import { useTranslation } from "react-i18next";
import { Container, Eyebrow, FaqList, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";
import { faqLd } from "../seo/jsonld";

export default function FaqPage() {
  const { t } = useTranslation();
  const FAQ = t("faqPage.items", { returnObjects: true }) as unknown as { q: string; a: string }[];
  usePageSeo({
    title: `${t("faq.title")} | Queen Vic Lloret de Mar`,
    description: t("faqPage.metaDescription"),
    path: "/faq",
    jsonLd: [faqLd(FAQ)],
  });

  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>FAQ</Eyebrow>
        <h1 className="font-display display-2 max-w-2xl font-bold text-ink-900">
          {t("faq.title")}
        </h1>
        <FaqList items={FAQ} className="mt-10" />
      </Container>
    </Section>
  );
}
