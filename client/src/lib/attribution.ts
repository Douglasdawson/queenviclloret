/** Collect UTM + referrer + landing page from the browser for lead attribution. */
export function collectAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k) ?? undefined;
  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    referrer: document.referrer || undefined,
    landingPage: window.location.pathname + window.location.search,
  };
}
