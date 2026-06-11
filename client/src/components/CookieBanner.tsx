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
    // Analytics bootstrapping would key off `value === "all"` here.
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-night-900/95 backdrop-blur">
      <Container className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-ink-soft">{t("cookies.message")}</p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => decide("essential")}>
            {t("cookies.reject")}
          </Button>
          <Button onClick={() => decide("all")}>{t("cookies.accept")}</Button>
        </div>
      </Container>
    </div>
  );
}
