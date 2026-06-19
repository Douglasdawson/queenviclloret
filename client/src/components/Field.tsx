import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../lib/cn";

const baseInput =
  "w-full rounded-[10px] border border-cream-300 bg-cream-100 px-4 py-3 text-base text-ink-900 placeholder:text-ink-600/50 transition-colors duration-200 focus:border-gold-600";

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="label-caps mb-1.5 block text-xs text-ink-600">{children}</span>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1.5 block text-[0.8125rem] font-medium text-crimson-500">{message}</span>;
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
        className={cn(baseInput, "appearance-none pr-10", className)}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M4 6l4 4 4-4" />
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
