import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button, Container, Kicker, Section } from "../components/ui";
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: { consentEmail: false } });

  usePageSeo({
    title: `${t("contact.title")} | Queen Vic Lloret de Mar`,
    description: t("contact.subtitle"),
    path: "/contact",
  });

  async function onSubmit(values: FormValues) {
    await apiPost("/public/contact", { ...values, ...collectAttribution() });
    setSent(true);
  }

  return (
    <Section className="pt-16">
      <Container>
        <Kicker>Find us</Kicker>
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("contact.title")}</h1>
        <p className="mt-4 max-w-xl text-ink-soft">{t("contact.subtitle")}</p>

        {sent ? (
          <p className="mt-10 rounded-xl border border-pitch-500/40 bg-pitch-500/10 p-5 text-pitch-400">
            {t("contact.form.success")}
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="relative mt-10 max-w-xl space-y-5">
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
            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input type="checkbox" className="mt-1" {...register("consentEmail")} />
              <span>{t("contact.form.consent")}</span>
            </label>
            <FieldError message={errors.consentEmail?.message} />
            <Button type="submit" disabled={isSubmitting}>
              {t("contact.form.submit")}
            </Button>
          </form>
        )}
      </Container>
    </Section>
  );
}
