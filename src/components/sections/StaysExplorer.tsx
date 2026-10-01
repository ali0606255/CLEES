"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { SearchX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { neighborhoods } from "~/content/neighborhoods";
import { units } from "~/content/units";
import { whatsappLink } from "~/site.config";
import { UnitCard } from "./UnitCard";

const bedroomFilters = ["any", "1", "2", "3", "4+"] as const;

export function StaysExplorer() {
  const t = useTranslations("stays");
  const tc = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const [hood, setHood] = useState("all");
  const [beds, setBeds] = useState<(typeof bedroomFilters)[number]>("any");

  // Only show neighborhoods that actually have units
  const availableHoods = neighborhoods.filter((n) => units.some((u) => u.neighborhood === n.id));

  const filtered = useMemo(
    () =>
      units.filter((u) => {
        if (hood !== "all" && u.neighborhood !== hood) return false;
        if (beds === "any") return true;
        if (beds === "4+") return u.bedrooms >= 4;
        return u.bedrooms === Number(beds);
      }),
    [hood, beds],
  );

  const chip = (active: boolean) =>
    cn(
      "inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold ring-1 ring-inset transition-colors",
      active ? "bg-primary text-white ring-primary" : "bg-white text-ink ring-line hover:ring-primary/40",
    );

  return (
    <section className="section pt-12" aria-label={t("filtersLabel")}>
      <div className="container-page">
        <div className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-end">
            <div>
              <label htmlFor="stays-hood" className="mb-2 block text-sm font-semibold text-ink">
                {t("filterNeighborhood")}
              </label>
              <select id="stays-hood" className="field h-11 py-0" value={hood} onChange={(e) => setHood(e.target.value)}>
                <option value="all">{t("allNeighborhoods")}</option>
                {availableHoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {locale === "ar" ? n.ar : n.en}
                  </option>
                ))}
              </select>
            </div>
            <fieldset className="min-w-0">
              <legend className="mb-2 text-sm font-semibold text-ink">{t("filterBedrooms")}</legend>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {bedroomFilters.map((b) => (
                  <button key={b} type="button" aria-pressed={beds === b} onClick={() => setBeds(b)} className={chip(beds === b)}>
                    {b === "any" ? t("bedroomsAny") : b === "4+" ? t("bedroomsPlus") : t("bedroomsN", { count: Number(b) })}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <p className="text-sm font-semibold text-muted" aria-live="polite">
            {t("results", { count: filtered.length })}
          </p>
        </div>

        <h2 className="sr-only">{t("results", { count: filtered.length })}</h2>
        {filtered.length ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((u, i) => (
                <m.li
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <UnitCard unit={u} eager={i < 2} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-[var(--radius-card)] border-2 border-dashed border-line px-6 py-16 text-center">
            <SearchX className="size-10 text-primary/40" aria-hidden />
            <p className="mt-4 max-w-md leading-relaxed text-muted">{t("empty")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setHood("all");
                  setBeds("any");
                }}
                className={buttonClasses("secondary")}
              >
                {t("reset")}
              </button>
              <a href={whatsappLink(tc("whatsappGreeting"))} target="_blank" rel="noopener noreferrer" className={buttonClasses("whatsapp")}>
                <BrandIcon name="whatsapp" className="size-5" />
                {tc("whatsapp")}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
