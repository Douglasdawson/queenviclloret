import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../lib/cn";

const baseInput =
  "w-full rounded-[10px] border border-cream-300 bg-cream-100 px-4 py-3 text-base text-ink-900 placeholder:text-ink-600/50 transition-colors duration-200 focus:border-gold-600";

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  const cls = "label-caps mb-1.5 block text-xs text-ink-600";
  return htmlFor ? (
    <label htmlFor={htmlFor} className={cls}>
      {children}
    </label>
  ) : (
    <span className={cls}>{children}</span>
  );
}

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" className="mt-1.5 block text-[0.8125rem] font-medium text-crimson-500">
      {message}
    </span>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(baseInput, className)} {...props} />;
  },
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(baseInput, "min-h-32", className)} {...props} />;
  },
);

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return (
    <span className="relative block">
      <select
        ref={ref}
        className={cn(baseInput, "appearance-none truncate pr-9", className)}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  );
});

/** Date/time input with a visible icon affordance. Native input drives the
 *  picker (best mobile UX); the native indicator is made transparent and laid
 *  over our icon so it stays tappable on desktop without showing twice. iOS
 *  opens the picker on any tap. `min-w-0` keeps it from collapsing in a grid. */
export const DateTimeInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { icon: "calendar" | "clock" }
>(function DateTimeInput({ className, icon, ...props }, ref) {
  return (
    <span className="relative block">
      <input
        ref={ref}
        className={cn(
          baseInput,
          "min-w-0 pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-y-0 [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-11 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
          className,
        )}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon === "calendar" ? (
          <>
            <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
            <path d="M3 9h18M8 2.5v4M16 2.5v4" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5V12l3 2" />
          </>
        )}
      </svg>
    </span>
  );
});

/** Visually-hidden honeypot field. Bots fill it, humans never see it. */
export function Honeypot({ register }: { register: object }) {
  return (
    <div className="absolute left-[-9999px]" aria-hidden="true">
      <label>
        Company
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}
