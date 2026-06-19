import { useTranslation } from "react-i18next";
import { Container, Eyebrow, Section } from "../components/ui";
import { ReserveButton } from "../components/ReserveButton";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { MENU, MENU_INTRO } from "../content/menu";

export default function MenuPage() {
  const { t } = useTranslation();
  const { locale } = useSite();

  usePageSeo({
    title: `${t("menu.title")} | Queen Vic Sports Bar Lloret de Mar`,
    description: t("menu.metaDescription"),
    path: "/menu",
  });

  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>{t("nav.menu")}</Eyebrow>
        <h1 className="font-display display-2 max-w-2xl font-bold text-ink-900">{t("menu.title")}</h1>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-600">
          {MENU_INTRO[locale]}
        </p>

        <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-x-16">
          {MENU.map((cat) => (
            <section key={cat.title.en}>
              <h2 className="font-display border-b border-cream-200 pb-2 text-xl font-bold text-ink-900">
                {cat.title[locale]}
              </h2>
              <ul className="mt-4 space-y-3">
                {cat.items.map((item) => (
                  <li key={item.name.en} className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.9375rem] text-ink-700">{item.name[locale]}</span>
                    <span className="tnum shrink-0 font-medium text-gold-700">{item.price}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-ink-600">{t("menu.note")}</p>
        <ReserveButton className="mt-6" />
      </Container>
    </Section>
  );
}
