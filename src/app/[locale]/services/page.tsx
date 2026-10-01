import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { CleaningChecklist } from "@/components/sections/CleaningChecklist";
import { Packages } from "@/components/sections/Packages";
import { FinalCta } from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "services", "/services");
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.page");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <ServiceCards withHeading={false} showLinks={false} />
      <CleaningChecklist />
      <Packages />
      <FinalCta title={t("ctaTitle")} subtitle={t("ctaBody")} />
    </>
  );
}
