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

/** Injects the GA4 loader + base config exactly once, under Consent Mode v2.
 *  The tag loads on every public page regardless of opt-in; storage starts
 *  `denied`, so GA4 sends cookieless pings (no cookie set) that it models into
 *  aggregate sessions. Granting consent later upgrades to full measurement. */
function bootGa4(id: string, granted: boolean) {
  if (booted) return;
  booted = true;

  window.gtag = gtag;

  // Consent Mode defaults MUST be pushed before `config` processes. `denied`
  // analytics_storage keeps us cookieless (GDPR posture for an EU venue) while
  // still letting GA4 model behavioural pings. wait_for_update gives the banner
  // a moment to flip consent before the first hit, avoiding a denied/granted race.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
    wait_for_update: 500,
  });

  gtag("js", new Date());
  // send_page_view fires the initial pageview; SPA route changes are tracked
  // manually below. anonymize_ip is a no-op in GA4 (always anonymized) but kept
  // as an explicit signal of intent.
  gtag("config", id, { send_page_view: true, anonymize_ip: true });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/** Flip analytics consent on an already-booted tag (no reload). */
function updateConsent(granted: boolean) {
  if (!booted || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

/**
 * Consent Mode v2 GA4. Renders nothing. Mounted only inside PublicLayout, so the
 * admin app (AdminShell) is never tracked. The id arrives via window.__GA4_ID__,
 * which the server injects only for public pages in prod when configured — so in
 * dev / on /admin / without env the id is absent and this is a no-op.
 */
export function Analytics() {
  const [location] = useLocation();
  const firstPageview = useRef(true);

  // Boot on mount regardless of opt-in: Consent Mode handles privacy, loading
  // denied-by-default and sending cookieless modeled pings until the visitor
  // accepts. The consent event then upgrades (or keeps denied), without reload.
  useEffect(() => {
    const id = window.__GA4_ID__;
    if (!id) return;

    bootGa4(id, hasAnalyticsConsent());

    function onConsent(e: Event) {
      updateConsent((e as CustomEvent<{ value?: string }>).detail?.value === "all");
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
