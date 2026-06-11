import type { DehydratedState } from "@tanstack/react-query";

declare global {
  interface Window {
    __APP_LANG__?: string;
    __QUERY_STATE__?: DehydratedState;
  }
}

export {};
