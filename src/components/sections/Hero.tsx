import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FileBarChart, ShieldCheck, Sparkles } from "lucide-react";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { whatsappLink } from "~/site.config";

export async function Hero() {
  const t = await getTranslations("home.hero");
  const tc = await getTranslations("common");

  return (
    <section className="relative overflow-hidden bg-sand pb-28 pt-28 sm:pt-32 lg:pb-36 lg:pt-40">
      {/* soft decorative shapes */}
      <div aria-hidden className="pointer-events-none absolute -end-48 -top-48 size-[40rem] rounded-full bg-[radial-gradient(closest-side,var(--clees-accent-soft),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -start-32 bottom-0 size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.7),transparent)]" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="hero-in lg:col-span-6">
          <span className="eyebrow bg-white/80">
            <Sparkles className="size-4 text-primary" aria-hidden />
            {t("eyebrow")}
          </span>
          <h1 className="mt-5 text-balance text-[2.35rem] font-bold leading-[1.2] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{t("subtitle")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/owners#evaluate" size="lg">
              {tc("evaluateFree")}
            </ButtonLink>
            <ExternalButton href={whatsappLink(tc("whatsappGreeting"))} variant="secondary" size="lg">
              <BrandIcon name="whatsapp" className="size-5 text-[#167a40]" />
              {tc("whatsapp")}
              <span className="sr-only">{tc("opensNewTab")}</span>
            </ExternalButton>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted">
            <ShieldCheck className="size-4 text-primary" aria-hidden />
            {t("trustLine")}
          </p>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)] ring-1 ring-black/5">
            <Image
              src="/images/hero-apartment.jpg"
              alt={t("imageAlt")}
              fill
              preload
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 start-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[var(--shadow-lift)] sm:start-6">
            <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-primary">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <span className="max-w-[11rem] text-sm font-semibold leading-snug text-ink">{t("badge1")}</span>
          </div>
          <div className="absolute -top-5 end-4 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[var(--shadow-lift)] sm:flex sm:end-6">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-accent">
              <FileBarChart className="size-5" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-ink">{t("badge2")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
