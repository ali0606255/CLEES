import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BedDouble, ExternalLink, MapPin, Users } from "lucide-react";
import { neighborhoodName } from "~/content/neighborhoods";
import type { Unit } from "~/content/units";

const platformOrder = ["airbnb", "gathern", "booking"] as const;

export function UnitCard({ unit, eager = false }: { unit: Unit; eager?: boolean }) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("common");
  const links = platformOrder.filter((p) => unit.links[p]);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={unit.image}
          alt={unit.imageAlt[locale]}
          fill
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
          <MapPin className="size-3.5" aria-hidden />
          {neighborhoodName(unit.neighborhood, locale)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-bold leading-snug text-ink">{unit.name[locale]}</h3>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4" aria-hidden />
            {t("bedrooms", { count: unit.bedrooms })}
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden />
            {t("guests", { count: unit.guests })}
          </li>
        </ul>
        {links.length > 0 && (
          <div className="mt-auto grid gap-2 pt-6" style={{ gridTemplateColumns: `repeat(${Math.min(links.length, 2)}, minmax(0, 1fr))` }}>
            {links.map((p, i) => (
              <a
                key={p}
                href={unit.links[p]}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  "inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors " +
                  (i === 0 ? "bg-primary text-white hover:bg-primary-600" : "bg-sand text-primary hover:bg-sand-200")
                }
              >
                {t("bookOn", { platform: t(`platforms.${p}`) })}
                <ExternalLink className="size-3.5" aria-hidden />
                <span className="sr-only">{t("opensNewTab")}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
