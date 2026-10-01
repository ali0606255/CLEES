import { getLocale, getTranslations } from "next-intl/server";
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "~/content/testimonials";
import { siteConfig } from "~/site.config";

export async function Testimonials() {
  if (!siteConfig.features.showTestimonials) return null;
  const t = await getTranslations("home.testimonials");
  const locale = (await getLocale()) as "ar" | "en";
  const hasReal = testimonials.length > 0;

  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="container-page">
        <SectionHeading id="testimonials-title" eyebrow={t("eyebrow")} title={t("title")} subtitle={hasReal ? undefined : t("empty")} />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {hasReal
            ? testimonials.map((item, i) => (
                <Reveal as="li" key={i} delay={i * 0.06}>
                  <figure className="flex h-full flex-col rounded-[var(--radius-card)] bg-sand p-7">
                    <Quote className="size-8 text-accent" aria-hidden />
                    {item.rating ? (
                      <div className="mt-4 flex gap-0.5" role="img" aria-label={`${item.rating}/5`}>
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className={"size-4 " + (s < item.rating! ? "fill-primary text-primary" : "text-line")} aria-hidden />
                        ))}
                      </div>
                    ) : null}
                    <blockquote className="mt-4 flex-1 leading-relaxed text-ink">{item.quote[locale]}</blockquote>
                    <figcaption className="mt-6">
                      <p className="font-bold text-ink">{item.name[locale]}</p>
                      <p className="text-sm text-muted">{item.role[locale]}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))
            : [0, 1, 2].map((i) => (
                <Reveal as="li" key={i} delay={i * 0.06}>
                  <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed border-line bg-sand/50 p-7 text-center">
                    <Quote className="size-8 text-primary/30" aria-hidden />
                    <p className="mt-4 text-sm font-semibold text-muted">{t("emptyHint")}</p>
                  </div>
                </Reveal>
              ))}
        </ul>
      </div>
    </section>
  );
}
