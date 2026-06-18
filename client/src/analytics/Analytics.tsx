import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const CONSENT_KEY = "qv.consent";
const CONSENT_EVENT = "qv:consent";

/** Module-level guard so neither the mount-read nor the consent event can
 *  bootstrap gtag twice (the component may also remount on navigation). */
let booted = false;

function gtag(...args: unknown[]) {
  (window.dataLayer = window.dataLayer || []).push(args);
}

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw)?.value === "all" : false;
  } catch {
    return false;
  }
}

/** Injects the GA4 loader + base config exactly once. */
function bootGa4(id: string) {
  if (booted) return;
  booted = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);

  window.gtag = gtag;
  gtag("js", new Date());
  // anonymize_ip: GDPR posture for an EU venue. send_page_view fires the
  // initial pageview; SPA route changes are tracked manually below.
  gtag("config", id, { send_page_view: true, anonymize_ip: true });
}

/**
 * Consent-gated GA4. Renders nothing. Mounted only inside PublicLayout, so the
 * admin app (AdminShell) is never tracked. The id arrives via window.__GA4_ID__,
 * which the server injects only for public pages in prod when configured — so in
 * dev / on /admin / without env the id is absent and this is a no-op.
 */
export function Analytics() {
  const [location] = useLocation();
  const firstPageview = useRef(true);

  // Boot when consent is (or becomes) granted, without a page reload.
  useEffect(() => {
    const id = window.__GA4_ID__;
    if (!id) return;

    if (hasAnalyticsConsent()) bootGa4(id);

    function onConsent(e: Event) {
      if ((e as CustomEvent<{ value?: string }>).detail?.value === "all") bootGa4(id!);
    }
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  // SPA pageviews on Wouter navigation. Skip the first run — the GA4 config
  // already sent the initial pageview, so firing here would double-count it.
  useEffect(() => {
    if (firstPageview.current) {
      firstPageview.current = false;
      return;
    }
    if (!booted || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);

  return null;
}
