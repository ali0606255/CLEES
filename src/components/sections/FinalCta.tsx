import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { whatsappLink } from "~/site.config";

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0C12.8 7 17 11.2 24 12 17 12.8 12.8 17 12 24 11.2 17 7 12.8 0 12 7 11.2 11.2 7 12 0Z" fill="currentColor" />
    </svg>
  );
}

export async function FinalCta({ title, subtitle, href = "/owners#evaluate" }: { title?: string; subtitle?: string; href?: string }) {
  const t = await getTranslations("home.cta");
  const tc = await getTranslations("common");

  return (
    <section className="py-16 sm:py-24" aria-labelledby="cta-title">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center sm:px-12 sm:py-20">
            <Sparkle className="absolute end-[10%] top-8 size-10 text-accent sm:size-14" />
            <Sparkle className="absolute end-[16%] top-24 size-5 text-accent/70" />
            <Sparkle className="absolute bottom-10 start-[8%] size-8 text-white/15" />
            <div aria-hidden className="absolute -bottom-24 -start-24 size-72 rounded-full bg-white/5" />
            <h2 id="cta-title" className="relative mx-auto max-w-3xl text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
              {title ?? t("title")}
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">{subtitle ?? t("subtitle")}</p>
            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={href} size="lg">
                {t("button")}
                <ArrowLeft className="size-4 ltr:-scale-x-100" aria-hidden />
              </ButtonLink>
              <ExternalButton href={whatsappLink(tc("whatsappGreeting"))} variant="outlineLight" size="lg">
                <BrandIcon name="whatsapp" className="size-5" />
                {tc("whatsapp")}
                <span className="sr-only">{tc("opensNewTab")}</span>
              </ExternalButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
