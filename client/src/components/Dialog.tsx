import type { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

/**
 * Heritage-styled modal over Radix Dialog. Radix handles focus-trap, Escape,
 * background scroll-lock, portal and ARIA. Renders nothing while closed (SSR-safe).
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible title (visually rendered as the modal heading). */
  title: string;
  children: ReactNode;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[80] bg-ink-900/60 backdrop-blur-sm" />
        <RadixDialog.Content
          className="fixed left-1/2 top-1/2 z-[81] max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto scroll-pt-20 rounded-[1.5rem] border border-cream-200 bg-cream-50 px-5 pb-5 shadow-[0_24px_60px_oklch(0.25_0.02_160/0.35)] focus:outline-none sm:px-8 sm:pb-8"
        >
          <div className="sticky top-0 z-10 -mx-5 mb-4 flex items-start justify-between gap-4 border-b border-cream-200 bg-cream-50 px-5 py-4 sm:-mx-8 sm:px-8">
            <RadixDialog.Title className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close
              aria-label="Close"
              className="-mr-1.5 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-2xl leading-none text-ink-600 transition-colors hover:text-ink-900"
            >
              ×
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
