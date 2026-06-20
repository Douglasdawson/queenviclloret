import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button, LaurelSeal } from "./ui";
import { DateTimeInput, FieldError, FieldLabel, Honeypot, Select, TextArea, TextInput } from "./Field";
import { emailSchema } from "@shared/validation/common";
import { apiPost } from "../lib/api";
import { collectAttribution } from "../lib/attribution";
import { buildReservationWaUrl } from "../lib/whatsapp";
import { ReviewCta } from "./ReviewCta";
import { useSite } from "../app/site-context";
import type { Locale } from "../lib/locale";

// Dial codes for the venue's audience (Costa Brava tourism), most-likely first.
const DIAL_CODES = [
  { code: "+34", flag: "🇪🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+33", flag: "🇫🇷" },
  { code: "+31", flag: "🇳🇱" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+32", flag: "🇧🇪" },
  { code: "+353", flag: "🇮🇪" },
  { code: "+39", flag: "🇮🇹" },
  { code: "+351", flag: "🇵🇹" },
  { code: "+41", flag: "🇨🇭" },
  { code: "+1", flag: "🇺🇸" },
] as const;
const DEFAULT_PREFIX: Record<Locale, string> = {
  es: "+34",
  ca: "+34",
  en: "+44",
  fr: "+33",
  nl: "+31",
};

// Agile request: only name + party size + date are required; email/phone are
// optional because confirmation happens over WhatsApp.
const formSchema = z.object({
  name: z.string().min(1, "Required").max(160),
  email: emailSchema.optional().or(z.literal("")),
  phonePrefix: z.string(),
  phoneLocal: z.string().max(40).optional(),
  partySize: z.coerce.number().int().min(1).max(500),
  reservationType: z.enum(["standard", "group", "stag_hen", "match_day", "birthday"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Required"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  specialRequests: z.string().max(1000).optional(),
  company: z.string().max(0).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const TYPES = ["group", "match_day", "stag_hen", "birthday", "standard"] as const;

/** Shared reservation-request form used by the /reservations page and the modal.
 *  On submit it opens a prefilled WhatsApp message AND saves the request to the CRM. */
export function ReservationForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation();
  const { locale } = useSite();
  const uid = useId();
  const [sent, setSent] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reservationType: "group",
      partySize: 6,
      phonePrefix: DEFAULT_PREFIX[locale] ?? "+34",
    },
  });

  function onSubmit(values: FormValues) {
    // Build + open WhatsApp synchronously (inside the user gesture → not blocked).
    const url = buildReservationWaUrl(
      {
        name: values.name,
        partySize: values.partySize,
        reservationType: values.reservationType,
        date: values.date,
        timeSlot: values.timeSlot || undefined,
        specialRequests: values.specialRequests,
      },
      t,
    );
    setWaUrl(url);
    window.open(url, "_blank", "noopener");

    // Combine dial-code prefix + local number into the E.164-ish phone string.
    const phone = values.phoneLocal?.trim()
      ? `${values.phonePrefix} ${values.phoneLocal.trim()}`
      : undefined;

    // Persist to the CRM (best-effort; WhatsApp is the live channel). The current
    // tab stays open (WhatsApp opens in a new one), so the request completes.
    void apiPost("/public/reservation", {
      name: values.name,
      email: values.email || undefined,
      phone,
      partySize: values.partySize,
      reservationType: values.reservationType,
      date: values.date,
      timeSlot: values.timeSlot || undefined,
      specialRequests: values.specialRequests,
      company: values.company,
      consentWhatsapp: true,
      ...collectAttribution(),
    }).catch(() => {});

    setSent(true);
    onSuccess?.();
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-cream-200 bg-cream-100 p-6 sm:p-8">
        <LaurelSeal className="w-[80px]" />
        <div>
          <p className="font-display text-lg font-bold text-ink-900">
            {t("reservations.wa.successTitle")}
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
            {t("reservations.wa.successBody")}
          </p>
        </div>
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-gold-500 px-6 text-sm font-semibold text-ink-900 transition-colors hover:bg-gold-600 hover:text-cream-50"
          >
            {t("reservations.wa.openButton")}
          </a>
        )}
        <div className="w-full">
          <ReviewCta />
        </div>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} className="relative">
      <Honeypot register={register("company")} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <div className="col-span-2">
          <FieldLabel htmlFor={`${uid}-name`}>{t("reservations.form.name")}</FieldLabel>
          <TextInput
            id={`${uid}-name`}
            autoComplete="name"
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            {...register("name")}
          />
          <FieldError id={`${uid}-name-err`} message={errors.name?.message} />
        </div>
        <div className="col-span-2">
          <FieldLabel htmlFor={`${uid}-phone`}>{`${t("reservations.form.phone")} ${t("form.optional")}`}</FieldLabel>
          <div className="flex gap-2">
            <Select
              {...register("phonePrefix")}
              aria-label={t("reservations.form.phonePrefix")}
              className="w-28 shrink-0 px-3"
            >
              {DIAL_CODES.map((d) => (
                <option key={d.code} value={d.code}>
                  {`${d.flag} ${d.code}`}
                </option>
              ))}
            </Select>
            <TextInput
              id={`${uid}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              className="flex-1"
              {...register("phoneLocal")}
            />
          </div>
        </div>
        <div>
          <FieldLabel htmlFor={`${uid}-party`}>{t("reservations.form.partySize")}</FieldLabel>
          <TextInput
            id={`${uid}-party`}
            type="number"
            min={1}
            aria-invalid={!!errors.partySize || undefined}
            aria-describedby={errors.partySize ? `${uid}-party-err` : undefined}
            {...register("partySize")}
          />
          <FieldError id={`${uid}-party-err`} message={errors.partySize?.message} />
        </div>
        <div>
          <FieldLabel htmlFor={`${uid}-type`}>{t("reservations.form.type")}</FieldLabel>
          <Select id={`${uid}-type`} {...register("reservationType")}>
            {TYPES.map((value) => (
              <option key={value} value={value}>
                {t(`reservations.occasions.${value}`)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor={`${uid}-date`}>{t("reservations.form.date")}</FieldLabel>
          <DateTimeInput
            id={`${uid}-date`}
            icon="calendar"
            type="date"
            min={todayIso}
            aria-invalid={!!errors.date || undefined}
            aria-describedby={errors.date ? `${uid}-date-err` : undefined}
            {...register("date")}
          />
          <FieldError id={`${uid}-date-err`} message={errors.date?.message} />
        </div>
        <div>
          <FieldLabel htmlFor={`${uid}-time`}>{`${t("reservations.form.time")} ${t("form.optional")}`}</FieldLabel>
          <DateTimeInput id={`${uid}-time`} icon="clock" type="time" {...register("timeSlot")} />
        </div>
        <div className="col-span-2">
          <FieldLabel htmlFor={`${uid}-email`}>{`${t("reservations.form.email")} ${t("form.optional")}`}</FieldLabel>
          <TextInput
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            {...register("email")}
          />
          <FieldError id={`${uid}-email-err`} message={errors.email?.message} />
        </div>
        <div className="col-span-2">
          <FieldLabel htmlFor={`${uid}-notes`}>{t("reservations.form.requests")}</FieldLabel>
          <TextArea id={`${uid}-notes`} className="min-h-20" {...register("specialRequests")} />
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-600">{t("reservations.wa.notice")}</p>
      <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="mt-5 w-full sm:w-auto">
        {t("cta.checkAvailability")}
      </Button>
    </form>
  );
}
