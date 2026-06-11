import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button, Container, Eyebrow, LaurelSeal, Section } from "../components/ui";
import { FieldError, FieldLabel, Honeypot, TextArea, TextInput } from "../components/Field";
import { emailSchema } from "@shared/validation/common";
import { apiPost } from "../lib/api";
import { collectAttribution } from "../lib/attribution";
import { usePageSeo } from "../seo/use-page-seo";

const formSchema = z.object({
  firstName: z.string().min(1, "Required").max(120),
  email: emailSchema,
  message: z.string().min(1, "Required").max(2000),
  consentEmail: z.boolean().refine((v) => v, "Required"),
  company: z.string().max(0).optional(),
});
type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { consentEmail: false },
  });

  usePageSeo({
    title: `${t("contact.title")} | Queen Vic Lloret de Mar`,
    description: t("contact.subtitle"),
    path: "/contact",
  });

  async function onSubmit(values: FormValues) {
    setServerError(false);
    try {
      await apiPost("/public/contact", { ...values, ...collectAttribution() });
      setSent(true);
    } catch {
      setServerError(true);
    }
  }

  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>{t("nav.contact")}</Eyebrow>
        <h1 className="font-display max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-tight text-ink-900">
          {t("contact.title")}
        </h1>
        <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
          {t("contact.subtitle")}
        </p>

        {sent ? (
          <div className="mt-12 flex max-w-xl flex-col items-start gap-5 rounded-2xl border border-cream-200 bg-cream-100 p-8">
            <LaurelSeal className="w-[88px]" />
            <p className="text-[1.0625rem] leading-relaxed text-ink-900">
              {t("contact.form.success")}
            </p>
          </div>
        ) : (
          <form method="post" onSubmit={handleSubmit(onSubmit)} className="relative mt-12 max-w-xl space-y-6">
            <Honeypot register={register("company")} />
            <div>
              <FieldLabel>{t("contact.form.name")}</FieldLabel>
              <TextInput {...register("firstName")} autoComplete="name" />
              <FieldError message={errors.firstName?.message} />
            </div>
            <div>
              <FieldLabel>{t("contact.form.email")}</FieldLabel>
              <TextInput type="email" {...register("email")} autoComplete="email" />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <FieldLabel>{t("contact.form.message")}</FieldLabel>
              <TextArea {...register("message")} />
              <FieldError message={errors.message?.message} />
            </div>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-600">
              <input type="checkbox" className="mt-1 accent-gold-600" {...register("consentEmail")} />
              <span>{t("contact.form.consent")}</span>
            </label>
            <FieldError message={errors.consentEmail?.message} />
            {serverError && (
              <p className="rounded-[10px] border border-crimson-500/40 bg-crimson-500/10 px-4 py-3 text-sm font-medium text-crimson-500">
                {t("form.serverError")}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? t("form.sending") : t("contact.form.submit")}
            </Button>
          </form>
        )}
      </Container>
    </Section>
  );
}
