import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Check, LayoutDashboard, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function ServiceCards({ withHeading = true, showLinks = true }: { withHeading?: boolean; showLinks?: boolean }) {
  const t = await getTranslations("home.services");
  const ts = await getTranslations("services");
  const tc = await getTranslations("common");

  // Without a section heading the cards sit right under the page h1, so they become h2s
  const CardTitle = withHeading ? "h3" : "h2";
  const cards = [
    { key: "cleaning", icon: Sparkles, image: "/images/service-cleaning.jpg", tone: "light" },
    { key: "management", icon: LayoutDashboard, image: "/images/service-management.jpg", tone: "dark" },
  ] as const;

  return (
    <section className="section bg-sand" aria-labelledby={withHeading ? "services-title" : undefined}>
      <div className="container-page">
        {withHeading && <SectionHeading id="services-title" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />}
        <div className={withHeading ? "mt-14 grid gap-6 lg:grid-cols-2" : "grid gap-6 lg:grid-cols-2"}>
          {cards.map((card, i) => {
            const Icon = card.icon;
            const dark = card.tone === "dark";
            const features = ts.raw(`${card.key}.features`) as string[];
            return (
              <Reveal key={card.key} delay={i * 0.1}>
                <article
                  id={card.key}
                  className={
                    "group flex h-full flex-col overflow-hidden rounded-[2rem] ring-1 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] " +
                    (dark ? "bg-primary text-white ring-primary" : "bg-white text-ink ring-line")
                  }
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={ts(`${card.key}.imageAlt`)}
                      fill
                      preload={!withHeading}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7 sm:p-9">
                    <span className={"grid size-12 place-items-center rounded-2xl " + (dark ? "bg-white/10 text-accent" : "bg-accent-soft text-primary")}>
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <CardTitle className="mt-5 text-2xl font-bold">{ts(`${card.key}.title`)}</CardTitle>
                    <p className={"mt-1 font-semibold " + (dark ? "text-accent" : "text-primary")}>{ts(`${card.key}.subtitle`)}</p>
                    <p className={"mt-4 leading-relaxed " + (dark ? "text-white/80" : "text-muted")}>{ts(`${card.key}.description`)}</p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span className={"mt-0.5 grid size-5 shrink-0 place-items-center rounded-full " + (dark ? "bg-accent text-primary-800" : "bg-primary text-white")}>
                            <Check className="size-3" strokeWidth={3} aria-hidden />
                          </span>
                          <span className={dark ? "text-white/90" : "text-ink"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {showLinks && (
                      <Link
                        href={`/services#${card.key}`}
                        className={"mt-8 inline-flex items-center gap-2 self-start font-semibold underline-offset-4 hover:underline " + (dark ? "text-accent" : "text-primary")}
                      >
                        {tc("learnMore")}
                        <span className="sr-only">: {ts(`${card.key}.title`)}</span>
                        <ArrowLeft className="size-4 ltr:-scale-x-100" aria-hidden />
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
