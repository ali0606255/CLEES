"use client";

import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { buttonClasses } from "@/components/ui/Button";
import { bedroomOptions, evaluationSchema, furnishedOptions, type EvaluationData, type EvaluationInput } from "@/lib/schemas";
import { trackLead } from "@/lib/track";
import { cn } from "@/lib/utils";
import { neighborhoodName, neighborhoods } from "~/content/neighborhoods";
import { serviceIds } from "~/content/packages";
import { whatsappLink } from "~/site.config";
import { Field, fieldA11y } from "./Field";
import { Honeypot } from "./Honeypot";
import { submitLead } from "./submitLead";

/** Reads ?neighborhood=&bedrooms=&furnished=&service= (from the calculator / packages) and pre-fills the form. */
function PrefillFromQuery({ setValue, onPrefill }: { setValue: UseFormSetValue<EvaluationInput>; onPrefill: () => void }) {
  const params = useSearchParams();
  useEffect(() => {
    let touched = false;
    const hood = params.get("neighborhood");
    if (hood && neighborhoods.some((n) => n.id === hood)) {
      setValue("neighborhood", hood);
      touched = true;
    }
    const beds = params.get("bedrooms");
    if (beds) {
      const v = Number(beds) >= 5 ? "5+" : beds;
      if ((bedroomOptions as readonly string[]).includes(v)) {
        setValue("bedrooms", v as EvaluationInput["bedrooms"]);
        touched = true;
      }
    }
    const furnished = params.get("furnished");
    if (furnished && (furnishedOptions as readonly string[]).includes(furnished)) {
      setValue("furnished", furnished as EvaluationInput["furnished"]);
      touched = true;
    }
    const service = params.get("service");
    if (service && (serviceIds as readonly string[]).includes(service)) {
      setValue("service", service as EvaluationInput["service"]);
      touched = true;
    }
    if (touched) onPrefill();
  }, [params, setValue, onPrefill]);
  return null;
}

export function EvaluationForm() {
  const t = useTranslations("form");
  const locale = useLocale() as "ar" | "en";
  const id = useId();
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [submitted, setSubmitted] = useState<EvaluationData | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const onPrefill = useCallback(() => setPrefilled(true), []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EvaluationInput, unknown, EvaluationData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      type: "evaluation",
      name: "",
      phone: "",
      neighborhood: "",
      // Empty selections fail validation with "required" until the user picks one
      bedrooms: "" as EvaluationInput["bedrooms"],
      service: "" as EvaluationInput["service"],
      notes: "",
      company_website: "",
      locale,
    },
  });

  const err = (key?: string) => (key ? t(`errors.${key}`) : undefined);

  const onSubmit = async (data: EvaluationData) => {
    setServerError(null);
    const res = await submitLead(data);
    if (!res.ok) {
      setServerError(t(`errors.${res.error}`));
      return;
    }
    trackLead("evaluation");
    setSubmitted(data);
    setStatus("success");
  };

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  if (status === "success" && submitted) {
    const message = t("whatsappMessage", {
      name: submitted.name,
      neighborhood: submitted.neighborhood === "other" ? t("otherNeighborhood") : neighborhoodName(submitted.neighborhood, locale),
      bedrooms: submitted.bedrooms,
      furnished: t(`furnishedOptions.${submitted.furnished}`),
      service: t(`serviceOptions.${submitted.service}`),
      phone: submitted.phone,
    });
    return (
      <m.div
        ref={successRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-[2rem] bg-white p-8 text-center outline-none ring-1 ring-line sm:p-12"
      >
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-primary">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-ink">{t("success.title", { name: submitted.name })}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-muted">{t("success.body")}</p>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={buttonClasses("whatsapp", "lg", "mt-8")}>
          <BrandIcon name="whatsapp" className="size-5" />
          {t("success.whatsapp")}
        </a>
        <button
          type="button"
          onClick={() => {
            reset();
            setSubmitted(null);
            setStatus("idle");
          }}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <RotateCcw className="size-4" aria-hidden />
          {t("success.again")}
        </button>
      </m.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-9">
      <Suspense fallback={null}>
        <PrefillFromQuery setValue={setValue} onPrefill={onPrefill} />
      </Suspense>
      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("locale")} />
      <Honeypot label={t("honeypot")} registration={register("company_website")} />

      <AnimatePresence>
        {prefilled && (
          <m.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-primary"
          >
            <Sparkles className="size-4 shrink-0" aria-hidden />
            {t("prefilled")}
          </m.p>
        )}
      </AnimatePresence>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label={t("name")} error={err(errors.name?.message)} required>
          <input
            {...fieldA11y(`${id}-name`, errors.name)}
            {...register("name")}
            className="field"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
          />
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
        <Field id={`${id}-hood`} label={t("neighborhood")} error={err(errors.neighborhood?.message)} required>
          <select {...fieldA11y(`${id}-hood`, errors.neighborhood)} {...register("neighborhood")} className="field">
            <option value="">{t("neighborhoodPlaceholder")}</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {locale === "ar" ? n.ar : n.en}
              </option>
            ))}
            <option value="other">{t("otherNeighborhood")}</option>
          </select>
        </Field>
        <Field id={`${id}-beds`} label={t("bedrooms")} error={err(errors.bedrooms?.message)} required>
          <select {...fieldA11y(`${id}-beds`, errors.bedrooms)} {...register("bedrooms")} className="field">
            <option value="" disabled>
              {t("bedroomsPlaceholder")}
            </option>
            {bedroomOptions.map((b) => (
              <option key={b} value={b}>
                {b === "5+" ? t("bedroomsMore") : t("bedroomsOption", { count: Number(b) })}
              </option>
            ))}
          </select>
        </Field>

        <fieldset className="sm:col-span-2" aria-describedby={errors.furnished ? `${id}-furn-error` : undefined}>
          <legend className="mb-2 text-sm font-semibold text-ink">
            {t("furnished")}
            <span className="ms-0.5 text-[#b42318]" aria-hidden>*</span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {furnishedOptions.map((o) => (
              <label
                key={o}
                className="flex h-12 cursor-pointer items-center gap-3 rounded-xl px-4 text-sm font-semibold text-ink ring-1 ring-inset ring-[#d5cfc4] transition-colors hover:ring-primary/50 has-[:checked]:bg-accent-soft has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent"
              >
                <input type="radio" value={o} {...register("furnished")} className="size-4 accent-[var(--clees-primary)]" />
                {t(`furnishedOptions.${o}`)}
              </label>
            ))}
          </div>
          {errors.furnished && (
            <p id={`${id}-furn-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#b42318]">
              <AlertCircle className="size-4" aria-hidden />
              {err(errors.furnished.message)}
            </p>
          )}
        </fieldset>

        <Field id={`${id}-service`} label={t("service")} error={err(errors.service?.message)} required className="sm:col-span-2">
          <select {...fieldA11y(`${id}-service`, errors.service)} {...register("service")} className="field">
            <option value="" disabled>
              {t("bedroomsPlaceholder")}
            </option>
            {serviceIds.map((s) => (
              <option key={s} value={s}>
                {t(`serviceOptions.${s}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-notes`} label={t("notes")} className="sm:col-span-2">
          <textarea {...register("notes")} id={`${id}-notes`} rows={3} className="field resize-y" placeholder={t("notesPlaceholder")} />
        </Field>
      </div>

      {serverError && (
        <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className={buttonClasses("primary", "lg", "mt-7 w-full")}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </button>
      <p className={cn("mt-4 text-center text-xs text-muted")}>
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
