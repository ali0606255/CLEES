import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { StaysExplorer } from "@/components/sections/StaysExplorer";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/stays">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "stays", "/stays");
}

export default async function StaysPage({ params }: PageProps<"/[locale]/stays">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stays");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <StaysExplorer />
    </>
  );
}
