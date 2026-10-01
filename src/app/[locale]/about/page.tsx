import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eye, Sparkles, Gem } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/about");
}

const valueIcons = [Sparkles, Eye, Gem];

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const values = t.raw("values") as { title: string; body: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} />

      <section className="section" aria-label={t("eyebrow")}>
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-black/5">
            <Image src="/images/about-story.jpg" alt={t("imageAlt")} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.08} className="space-y-5 text-lg leading-loose text-ink/90">
            <p>{t("intro")}</p>
            <p>{t("story")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-sand" aria-labelledby="values-title">
        <div className="container-page">
          <SectionHeading id="values-title" title={t("valuesTitle")} />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <Reveal as="li" key={v.title} delay={i * 0.08} className="rounded-[2rem] bg-white p-8 ring-1 ring-line">
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary text-accent">
                    <Icon className="size-7" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-ink">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
