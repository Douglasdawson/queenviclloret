import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiPost } from "../lib/api";
import { collectAttribution } from "../lib/attribution";

/** Compact newsletter capture for the footer. Stores a consented marketing
 *  lead via POST /public/subscribe (delivery wired later). */
export function NewsletterSignup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || state === "sending") return;
    setState("sending");
    try {
      await apiPost("/public/subscribe", { email, consentEmail: true, ...collectAttribution() });
      setState("ok");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return <p className="text-sm leading-relaxed text-gold-400">{t("newsletter.ok")}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="label-caps text-xs text-gold-400">{t("newsletter.title")}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="nl-email">
          {t("newsletter.placeholder")}
        </label>
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter.placeholder")}
          autoComplete="email"
          className="min-h-11 flex-1 rounded-[10px] border border-green-700 bg-green-900 px-3 text-sm text-paper placeholder:text-paper-dim/60 focus:border-gold-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!consent || state === "sending"}
          className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-gold-500 px-4 text-sm font-semibold text-ink-900 transition-colors hover:bg-gold-600 disabled:opacity-50"
        >
          {state === "sending" ? t("form.sending") : t("newsletter.cta")}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-paper-dim">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-gold-500"
        />
        <span>{t("newsletter.consent")}</span>
      </label>
      {state === "error" && <p className="text-xs text-dusk-400">{t("form.serverError")}</p>}
    </form>
  );
}
