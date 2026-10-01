import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bell, Camera, Check, FileBarChart, HeartHandshake, LayoutDashboard, Megaphone, Sparkles, Tag, Wallet, Wrench, X } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Calculator } from "@/components/sections/Calculator";
import { Faq } from "@/components/sections/Faq";
import { EvaluationForm } from "@/components/forms/EvaluationForm";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/owners">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "owners", "/owners");
}

const whatIcons = [Camera, Megaphone, Tag, HeartHandshake, Sparkles, Wrench];
const deliverIcons = [FileBarChart, Wallet, Bell, LayoutDashboard];

export default async function OwnersPage({ params }: PageProps<"/[locale]/owners">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("owners");
  const tc = await getTranslations("common");
  const what = t.raw("whatWeDo.items") as { title: string; body: string }[];
  const deliver = t.raw("deliverables.items") as { title: string; body: string; soon?: string }[];
  const rows = t.raw("compare.rows") as { aspect: string; self: string; clees: string }[];
  const points = t.raw("formSection.points") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={{ src: "/images/owners-hero.jpg", alt: t("hero.imageAlt") }}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#evaluate" size="lg">
            {tc("evaluateFree")}
          </ButtonLink>
          <ButtonLink href="#calculator" variant="secondary" size="lg">
            {t("hero.calcCta")}
          </ButtonLink>
        </div>
      </PageHero>

      {/* What we do */}
      <section className="section" aria-labelledby="what-title">
        <div className="container-page">
          <SectionHeading id="what-title" eyebrow={t("whatWeDo.eyebrow")} title={t("whatWeDo.title")} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {what.map((item, i) => {
              const Icon = whatIcons[i];
              return (
                <Reveal as="li" key={item.title} delay={i * 0.05} className="rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-line transition-shadow hover:shadow-[var(--shadow-soft)]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-primary">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section bg-primary text-white" aria-labelledby="deliver-title">
        <div className="container-page">
          <SectionHeading id="deliver-title" tone="light" eyebrow={t("deliverables.eyebrow")} title={t("deliverables.title")} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deliver.map((item, i) => {
              const Icon = deliverIcons[i];
              return (
                <Reveal as="li" key={item.title} delay={i * 0.06} className="relative rounded-[var(--radius-card)] bg-white/[0.06] p-7 ring-1 ring-white/10">
                  {item.soon ? (
                    <span className="absolute end-5 top-5 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary-800">{item.soon}</span>
                  ) : null}
                  <Icon className="size-7 text-accent" aria-hidden />
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/75">{item.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Comparison */}
      <section className="section" aria-labelledby="compare-title">
        <div className="container-page">
          <SectionHeading id="compare-title" eyebrow={t("compare.eyebrow")} title={t("compare.title")} />
          <Reveal className="mx-auto mt-12 max-w-4xl">
            <div className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-line">
              <table className="w-full table-fixed border-collapse text-start text-sm sm:text-base">
                <caption className="sr-only">{t("compare.title")}</caption>
                <thead>
                  <tr className="bg-sand">
                    <th scope="col" className="hidden w-1/4 p-4 text-start font-semibold text-muted sm:table-cell sm:p-5">
                      {t("compare.aspect")}
                    </th>
                    <th scope="col" className="p-4 text-start font-semibold text-muted sm:p-5">
                      {t("compare.self")}
                    </th>
                    <th scope="col" className="bg-primary p-4 text-start font-bold text-white sm:p-5">
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="size-4 text-accent" aria-hidden />
                        {t("compare.clees")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.aspect} className="border-t border-line align-top">
                      <th scope="row" className="hidden p-4 text-start font-semibold text-ink sm:table-cell sm:p-5">
                        {row.aspect}
                      </th>
                      <td className="p-4 text-muted sm:p-5">
                        <span className="mb-1 block text-xs font-semibold text-ink sm:hidden">{row.aspect}</span>
                        <span className="flex items-start gap-2">
                          <X className="mt-1 size-4 shrink-0 text-[#b42318]/70" aria-hidden />
                          {row.self}
                        </span>
                      </td>
                      <td className="bg-accent-soft/60 p-4 font-semibold text-ink sm:p-5">
                        <span className="mb-1 block text-xs font-semibold text-transparent sm:hidden" aria-hidden>
                          {row.aspect}
                        </span>
                        <span className="flex items-start gap-2">
                          <Check className="mt-1 size-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                          {row.clees}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="bg-sand">
        <Calculator />
      </div>

      {/* Evaluation form */}
      <section id="evaluate" className="section" aria-labelledby="evaluate-title">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-28">
              <span className="eyebrow">{t("formSection.eyebrow")}</span>
              <h2 id="evaluate-title" className="mt-4 text-3xl font-bold leading-[1.25] tracking-tight text-ink sm:text-4xl">
                {t("formSection.title")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{t("formSection.subtitle")}</p>
              <ul className="mt-8 space-y-4">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-3 font-semibold text-ink">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-primary-800">
                      <Check className="size-4" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <EvaluationForm />
          </div>
        </div>
      </section>

      <Faq />
    </>
  );
}
