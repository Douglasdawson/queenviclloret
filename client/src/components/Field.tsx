import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../lib/cn";

const baseInput =
  "w-full rounded-xl border border-white/15 bg-night-900/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-electric-400";

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">{children}</span>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-xs text-crimson-500">{message}</span>;
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

/** Visually-hidden honeypot field — bots fill it, humans don't. */
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
