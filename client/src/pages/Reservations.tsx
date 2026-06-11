import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button, Container, Kicker, Section } from "../components/ui";
import { FieldError, FieldLabel, Honeypot, TextArea, TextInput } from "../components/Field";
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
    await apiPost("/public/reservation", {
      ...values,
      timeSlot: values.timeSlot || undefined,
      ...collectAttribution(),
    });
    setSent(true);
  }

  return (
    <Section className="pt-16">
      <Container>
        <Kicker>Groups & match days</Kicker>
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("reservations.title")}</h1>
        <p className="mt-4 max-w-xl text-ink-soft">{t("reservations.subtitle")}</p>

        {sent ? (
          <p className="mt-10 rounded-xl border border-pitch-500/40 bg-pitch-500/10 p-5 text-pitch-400">
            {t("reservations.form.success")}
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="relative mt-10 max-w-2xl space-y-5">
            <Honeypot register={register("company")} />
            <div className="grid gap-5 sm:grid-cols-2">
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
                <select
                  {...register("reservationType")}
                  className="w-full rounded-xl border border-white/15 bg-night-900/60 px-4 py-3 text-sm text-ink"
                >
                  {TYPES.map((ty) => (
                    <option key={ty} value={ty}>
                      {ty.replace("_", " / ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>{t("reservations.form.date")}</FieldLabel>
                <TextInput type="date" {...register("date")} />
                <FieldError message={errors.date?.message} />
              </div>
              <div>
                <FieldLabel>{t("reservations.form.time")}</FieldLabel>
                <TextInput type="time" {...register("timeSlot")} />
              </div>
            </div>
            <div>
              <FieldLabel>{t("reservations.form.requests")}</FieldLabel>
              <TextArea {...register("specialRequests")} />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {t("reservations.form.submit")}
            </Button>
          </form>
        )}
      </Container>
    </Section>
  );
}
