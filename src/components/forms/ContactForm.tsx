"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { contactSchema, topicOptions, type ContactData, type ContactInput } from "@/lib/schemas";
import { trackLead } from "@/lib/track";
import { Field, fieldA11y } from "./Field";
import { Honeypot } from "./Honeypot";
import { submitLead } from "./submitLead";

export function ContactForm() {
  const t = useTranslations("form");
  const locale = useLocale() as "ar" | "en";
  const id = useId();
  const [sentName, setSentName] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "contact",
      name: "",
      phone: "",
      email: "",
      topic: "owner",
      message: "",
      company_website: "",
      locale,
    },
  });
  const err = (key?: string) => (key ? t(`errors.${key}`) : undefined);

  const onSubmit = async (data: ContactData) => {
    setServerError(null);
    const res = await submitLead(data);
    if (!res.ok) return setServerError(t(`errors.${res.error}`));
    trackLead("contact");
    setSentName(data.name);
  };

  if (sentName) {
    return (
      <m.div
        role="status"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-[2rem] bg-white p-10 text-center ring-1 ring-line"
      >
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-primary">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-ink">{t("success.contactTitle", { name: sentName })}</h3>
        <p className="mt-3 text-muted">{t("success.contactBody")}</p>
      </m.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-9">
      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("locale")} />
      <Honeypot label={t("honeypot")} registration={register("company_website")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label={t("name")} error={err(errors.name?.message)} required>
          <input {...fieldA11y(`${id}-name`, errors.name)} {...register("name")} className="field" autoComplete="name" placeholder={t("namePlaceholder")} />
        </Field>
        <Field id={`${id}-phone`} label={t("phone")} error={err(errors.phone?.message)} required>
          <input
            {...fieldA11y(`${id}-phone`, errors.phone)}
            {...register("phone")}
            className="field text-start"
            dir="ltr"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={t("phonePlaceholder")}
          />
        </Field>
        <Field id={`${id}-email`} label={t("email")} error={err(errors.email?.message)}>
          <input
            {...fieldA11y(`${id}-email`, errors.email)}
            {...register("email")}
            className="field text-start"
            dir="ltr"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
          />
        </Field>
        <Field id={`${id}-topic`} label={t("topic")} error={err(errors.topic?.message)} required>
          <select {...fieldA11y(`${id}-topic`, errors.topic)} {...register("topic")} className="field">
            {topicOptions.map((o) => (
              <option key={o} value={o}>
                {t(`topicOptions.${o}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-message`} label={t("message")} error={err(errors.message?.message)} required className="sm:col-span-2">
          <textarea
            {...fieldA11y(`${id}-message`, errors.message)}
            {...register("message")}
            rows={5}
            className="field resize-y"
            placeholder={t("messagePlaceholder")}
          />
        </Field>
      </div>
      {serverError && (
        <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {serverError}
        </p>
      )}
      <button type="submit" disabled={isSubmitting} className={buttonClasses("dark", "lg", "mt-7 w-full")}>
        {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-4 rtl:-scale-x-100" aria-hidden />}
        {isSubmitting ? t("submitting") : t("submitContact")}
      </button>
      <p className="mt-4 text-center text-xs text-muted">
        {t.rich("privacyNote", {
          link: (chunks) => (
            <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
