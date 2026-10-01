import { getTranslations } from "next-intl/server";
import { BedDouble, Headset, Star, TrendingUp } from "lucide-react";
import { siteConfig } from "~/site.config";

const icons = { units: BedDouble, rating: Star, occupancy: TrendingUp, support: Headset } as const;

export async function TrustBar() {
  if (!siteConfig.features.showTrustBar) return null;
  const t = await getTranslations("home.trust");
  const tc = await getTranslations("common");

  return (
    <section aria-labelledby="trust-title" className="relative z-10 -mt-16 lg:-mt-20">
      <div className="container-page">
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)] ring-1 ring-line sm:p-8">
          <h2 id="trust-title" className="sr-only">
            {t("title")}
          </h2>
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {siteConfig.trustStats.map((s) => {
              const Icon = icons[s.key];
              return (
                <div key={s.key} className="flex flex-col gap-1 lg:px-6 lg:first:ps-0">
                  <dt className="order-2 text-sm text-muted">{t(s.key)}</dt>
                  <dd className="order-1 flex flex-col gap-2">
                    <Icon className="size-5 text-primary/70" aria-hidden />
                    <span className="text-2xl font-bold text-primary sm:text-3xl" dir="ltr" style={{ textAlign: "start" }}>
                      {s.value}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-5 text-xs text-muted">* {tc("placeholderNote")}</p>
        </div>
      </div>
    </section>
  );
}
