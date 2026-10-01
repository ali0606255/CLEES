import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { Calculator } from "@/components/sections/Calculator";
import { Packages } from "@/components/sections/Packages";
import { WhyAbha } from "@/components/sections/WhyAbha";
import { FeaturedUnits } from "@/components/sections/FeaturedUnits";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <ServiceCards />
      <Calculator />
      <Packages />
      <WhyAbha />
      <FeaturedUnits />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
