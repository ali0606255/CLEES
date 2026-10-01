"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, Calculator as CalcIcon, CloudFog, Info, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { calculatorConfig, estimateIncome, type FurnishingId } from "~/content/calculator";
import { neighborhoods } from "~/content/neighborhoods";
import { cn, formatNumber } from "@/lib/utils";

type SegmentOption = { value: string; label: string };

function Segmented({ legend, name, options, value, onChange }: { legend: string; name: string; options: SegmentOption[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-ink">{legend}</legend>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "relative flex h-12 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-sm font-semibold ring-1 ring-inset transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                checked ? "bg-primary text-white ring-primary" : "bg-white text-ink ring-line hover:ring-primary/40",
              )}
            >
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Calculator({ withHeading = true }: { withHeading?: boolean }) {
  const t = useTranslations("home.calculator");
  const locale = useLocale();
  const id = useId();
  const [neighborhood, setNeighborhood] = useState<string>(neighborhoods[0].id);
  const [bedrooms, setBedrooms] = useState("2");
  const [furnishing, setFurnishing] = useState<FurnishingId>("good");

  const result = useMemo(
    () => estimateIncome({ neighborhood, bedrooms: Number(bedrooms), furnishing }),
    [neighborhood, bedrooms, furnishing],
  );
  const currency = calculatorConfig.currency[locale as "ar" | "en"];
  const fmt = (n: number) => formatNumber(n, locale);
  const key = `${neighborhood}-${bedrooms}-${furnishing}`;

  const seasons = [
    { k: "high", icon: Sun, data: result.high, label: t("highSeason"), hint: t("highSeasonHint") },
    { k: "low", icon: CloudFog, data: result.low, label: t("lowSeason"), hint: t("lowSeasonHint") },
  ] as const;

  return (
    <section id="calculator" className="section" aria-labelledby={`${id}-title`}>
      <div className="container-page">
        {withHeading ? (
          <SectionHeading id={`${id}-title`} eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        ) : (
          <h2 id={`${id}-title`} className="sr-only">
            {t("title")}
          </h2>
        )}

        <div className="mt-12 grid overflow-hidden rounded-[2rem] bg-white shadow-[var(--shadow-lift)] ring-1 ring-line lg:grid-cols-5">
          <form className="flex flex-col gap-7 p-6 sm:p-9 lg:col-span-3" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor={`${id}-hood`} className="mb-2.5 block text-sm font-semibold text-ink">
                {t("neighborhood")}
              </label>
              <select id={`${id}-hood`} className="field h-12" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {locale === "ar" ? n.ar : n.en}
                  </option>
                ))}
              </select>
            </div>
            <Segmented
              legend={t("bedrooms")}
              name={`${id}-bedrooms`}
              value={bedrooms}
              onChange={setBedrooms}
              options={calculatorConfig.bedrooms.map((b) => ({
                value: String(b),
                label: b === calculatorConfig.bedrooms.at(-1) ? `${b}+` : t("bedroomsOption", { count: b }),
              }))}
            />
            <Segmented
              legend={t("furnishing")}
              name={`${id}-furnishing`}
              value={furnishing}
              onChange={(v) => setFurnishing(v as FurnishingId)}
              options={calculatorConfig.furnishing.map((f) => ({ value: f.id, label: t(`furnishingOptions.${f.id}`) }))}
            />
            <p className="mt-auto flex items-start gap-3 rounded-2xl bg-sand p-4 text-sm leading-relaxed text-muted">
              <CalcIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              {t("method")}
            </p>
          </form>

          <div className="relative flex flex-col bg-primary p-6 text-white sm:p-9 lg:col-span-2">
            <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 size-48 rounded-full bg-white/5" />
            <p className="text-sm font-semibold text-accent">{t("resultTitle")}</p>
            <div className="mt-5 grid gap-4" aria-live="polite">
              {seasons.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.k} className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2 font-semibold">
                        <Icon className="size-4 text-accent" aria-hidden />
                        {s.label}
                      </span>
                      <span className="text-white/70">{s.hint}</span>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      <m.p
                        key={key}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 text-2xl font-bold tracking-tight sm:text-[1.7rem]"
                      >
                        <span dir="ltr" className="inline-block">
                          {fmt(s.data.min)} – {fmt(s.data.max)}
                        </span>{" "}
                        <span className="text-base font-semibold text-white/80">{currency}</span>
                      </m.p>
                    </AnimatePresence>
                    <p className="mt-1 text-sm text-white/70">{t("occupancy", { value: Math.round(s.data.occupancy * 100) })}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-white/80">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              {t("disclaimer")}
            </p>
            <Link
              href={{ pathname: "/owners", query: { neighborhood, bedrooms, furnished: "yes" }, hash: "evaluate" }}
              className={buttonClasses("primary", "lg", "mt-7 w-full")}
            >
              {t("cta")}
              <ArrowLeft className="size-4 ltr:-scale-x-100" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
