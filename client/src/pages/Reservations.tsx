import { useTranslation } from "react-i18next";
import { Container, Eyebrow, Section } from "../components/ui";
import { ReservationForm } from "../components/ReservationForm";
import { usePageSeo } from "../seo/use-page-seo";

export default function ReservationsPage() {
  const { t } = useTranslation();

  usePageSeo({
    title: `${t("reservations.title")} | Queen Vic Lloret de Mar`,
    description: t("reservations.subtitle"),
    path: "/reservations",
  });

  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>{t("nav.reservations")}</Eyebrow>
        <h1 className="font-display display-2 max-w-2xl font-bold text-ink-900">
          {t("reservations.title")}
        </h1>
        <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
          {t("reservations.subtitle")}
        </p>
        <div className="mt-12 max-w-2xl">
          <ReservationForm />
        </div>
      </Container>
    </Section>
  );
}
