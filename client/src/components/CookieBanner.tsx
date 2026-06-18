import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container } from "./ui";

const KEY = "qv.consent";

/** GDPR consent banner. No analytics/marketing scripts load before opt-in. */
export function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function decide(value: "all" | "essential") {
    localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
    setVisible(false);
    // Notify the analytics loader in the same tab (the `storage` event does not
    // fire in the tab that wrote the value). It boots GA4 when value === "all".
    window.dispatchEvent(new CustomEvent("qv:consent", { detail: { value } }));
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t-2 border-gold-500 bg-green-950 text-paper"
    >
      <Container className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-paper-dim">{t("cookies.message")}</p>
        <div className="flex shrink-0 gap-2.5">
          <Button variant="outline" onClick={() => decide("essential")}>
            {t("cookies.reject")}
          </Button>
          <Button onClick={() => decide("all")}>{t("cookies.accept")}</Button>
        </div>
      </Container>
    </div>
  );
}
