import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CalendarDays, Mountain, Sun, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const icons = [Sun, Mountain, CalendarDays, Users];

export async function WhyAbha() {
  const t = await getTranslations("home.whyAbha");
  const points = t.raw("points") as { title: string; body: string }[];

  return (
    <section className="section" aria-labelledby="abha-title">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-last lg:order-none">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] ring-1 ring-black/5">
            <Image src="/images/why-abha.jpg" alt={t("imageAlt")} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 id="abha-title" className="mt-4 text-balance text-3xl font-bold leading-[1.25] tracking-tight text-ink sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t("body")}</p>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {points.map((p, i) => {
              const Icon = icons[i];
              return (
                <Reveal as="li" key={p.title} delay={i * 0.06} className="rounded-2xl bg-sand p-5">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-3 font-bold text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
