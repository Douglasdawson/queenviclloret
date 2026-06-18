import { useTranslation } from "react-i18next";
import { Container, Eyebrow, Section } from "../components/ui";
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
        <h1 className="font-display max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-tight text-ink-900">
          {t("faq.title")}
        </h1>
        <div className="mt-10 max-w-2xl divide-y divide-cream-200">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-display text-lg font-bold text-ink-900 marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="tnum select-none text-xl font-medium text-gold-600 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
