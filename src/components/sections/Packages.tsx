import { getLocale, getTranslations } from "next-intl/server";
import { Check, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { packages } from "~/content/packages";
import { cn } from "@/lib/utils";

export async function Packages() {
  const t = await getTranslations("home.packages");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as "ar" | "en";

  return (
    <section id="packages" className="section bg-sand" aria-labelledby="packages-title">
      <div className="container-page">
        <SectionHeading id="packages-title" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {packages.map((pkg, i) => {
            const rec = pkg.recommended;
            const features = t.raw(`items.${pkg.id}.features`) as string[];
            return (
              <Reveal key={pkg.id} delay={i * 0.08} className={cn(rec && "lg:-my-4")}>
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-[2rem] p-7 transition-shadow duration-300 sm:p-8",
                    rec ? "bg-primary text-white shadow-[var(--shadow-lift)] ring-2 ring-accent" : "bg-white text-ink ring-1 ring-line hover:shadow-[var(--shadow-soft)]",
                  )}
                >
                  {rec && (
                    <span className="absolute -top-3.5 start-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-primary-800">
                      <Star className="size-3.5 fill-current" aria-hidden />
                      {tc("recommended")}
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{t(`items.${pkg.id}.name`)}</h3>
                  <p className={cn("mt-2 min-h-[3rem] leading-relaxed", rec ? "text-white/80" : "text-muted")}>{t(`items.${pkg.id}.description`)}</p>
                  <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                    <span className={cn("text-3xl font-bold", rec ? "text-accent" : "text-primary")}>{pkg.price[locale]}</span>
                    <span className={cn("text-sm", rec ? "text-white/75" : "text-muted")}>{t(pkg.unit)}</span>
                  </p>
                  <ul className={cn("mt-6 flex-1 space-y-3 border-t pt-6", rec ? "border-white/15" : "border-line")}>
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className={cn("mt-1 size-4 shrink-0", rec ? "text-accent" : "text-primary")} strokeWidth={3} aria-hidden />
                        <span className={rec ? "text-white/90" : "text-ink"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={{ pathname: "/owners", query: { service: pkg.id }, hash: "evaluate" }}
                    variant={rec ? "primary" : "secondary"}
                    className="mt-8 w-full"
                  >
                    {t("choose")}
                    <span className="sr-only">: {t(`items.${pkg.id}.name`)}</span>
                  </ButtonLink>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
