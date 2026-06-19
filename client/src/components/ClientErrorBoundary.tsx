import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * Last line of defence for the client: a render error anywhere in the tree
 * would otherwise blank the page. We catch it and show a branded fallback with
 * a way back home. (SSR output is unaffected — this only guards the browser.)
 */
export class ClientErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface it for debugging / future error reporting.
    console.error("[ClientErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dusk-deep px-6 text-center text-paper">
        <p className="font-display text-6xl font-bold leading-none text-gold-400">Oops</p>
        <h1 className="font-display mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-paper-dim">
          The page hit an unexpected error. Please reload, or head back to the homepage.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-dusk-deep transition-colors hover:bg-gold-300"
        >
          Back to home
        </a>
      </div>
    );
  }
}
