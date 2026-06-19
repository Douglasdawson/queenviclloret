import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button, Container, Eyebrow, LaurelSeal, Section } from "../components/ui";
import { FieldError, FieldLabel, Honeypot, Select, TextArea, TextInput } from "../components/Field";
import { emailSchema, phoneSchema } from "@shared/validation/common";
import { apiPost } from "../lib/api";
import { collectAttribution } from "../lib/attribution";
import { usePageSeo } from "../seo/use-page-seo";

const formSchema = z.object({
  name: z.string().min(1, "Required").max(160),
  email: emailSchema,
  phone: phoneSchema,
  partySize: z.coerce.number().int().min(1).max(500),
  reservationType: z.enum(["standard", "group", "stag_hen", "match_day", "birthday"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Required"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  specialRequests: z.string().max(1000).optional(),
  consentEmail: z.boolean().optional(),
  company: z.string().max(0).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const TYPES = ["group", "match_day", "stag_hen", "birthday", "standard"] as const;

export default function ReservationsPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { reservationType: "group", partySize: 6 },
  });

  usePageSeo({
    title: `${t("reservations.title")} | Queen Vic Lloret de Mar`,
    description: t("reservations.subtitle"),
    path: "/reservations",
  });

  async function onSubmit(values: FormValues) {
    setServerError(false);
    try {
      await apiPost("/public/reservation", {
        ...values,
        timeSlot: values.timeSlot || undefined,
        ...collectAttribution(),
      });
      setSent(true);
    } catch {
      setServerError(true);
    }
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>{t("nav.reservations")}</Eyebrow>
        <h1 className="font-display display-2 max-w-2xl font-bold text-ink-900">
          {t("reservations.title")}
        </h1>
        <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
          {t("reservations.subtitle")}
        </p>

        {sent ? (
          <div className="mt-12 flex max-w-xl flex-col items-start gap-5 rounded-2xl border border-cream-200 bg-cream-100 p-8">
            <LaurelSeal className="w-[88px]" />
            <p className="text-[1.0625rem] leading-relaxed text-ink-900">
              {t("reservations.form.success")}
            </p>
          </div>
        ) : (
          <form method="post" onSubmit={handleSubmit(onSubmit)} className="relative mt-12 max-w-2xl">
            <Honeypot register={register("company")} />
            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
              <div>
                <FieldLabel>{t("reservations.form.name")}</FieldLabel>
                <TextInput {...register("name")} autoComplete="name" />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <FieldLabel>{t("reservations.form.email")}</FieldLabel>
                <TextInput type="email" {...register("email")} autoComplete="email" />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <FieldLabel>{t("reservations.form.phone")}</FieldLabel>
                <TextInput {...register("phone")} autoComplete="tel" />
                <FieldError message={errors.phone?.message} />
              </div>
              <div>
                <FieldLabel>{t("reservations.form.partySize")}</FieldLabel>
                <TextInput type="number" min={1} {...register("partySize")} />
                <FieldError message={errors.partySize?.message} />
              </div>
              <div>
                <FieldLabel>{t("reservations.form.type")}</FieldLabel>
                <Select {...register("reservationType")}>
                  {TYPES.map((value) => (
                    <option key={value} value={value}>
                      {t(`reservations.occasions.${value}`)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <FieldLabel>{t("reservations.form.date")}</FieldLabel>
                  <TextInput type="date" min={todayIso} {...register("date")} />
                  <FieldError message={errors.date?.message} />
                </div>
                <div>
                  <FieldLabel>{t("reservations.form.time")}</FieldLabel>
                  <TextInput type="time" {...register("timeSlot")} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>{t("reservations.form.requests")}</FieldLabel>
                <TextArea {...register("specialRequests")} />
              </div>
            </div>
            {serverError && (
              <p className="mt-6 rounded-[10px] border border-crimson-500/40 bg-crimson-500/10 px-4 py-3 text-sm font-medium text-crimson-500">
                {t("form.serverError")}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="mt-8">
              {isSubmitting ? t("form.sending") : t("reservations.form.submit")}
            </Button>
          </form>
        )}
      </Container>
    </Section>
  );
}
