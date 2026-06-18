import type { DehydratedState } from "@tanstack/react-query";

declare global {
  interface Window {
    __APP_LANG__?: string;
    __QUERY_STATE__?: DehydratedState;
    __GA4_ID__?: string;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export {};
