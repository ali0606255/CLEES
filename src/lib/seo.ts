import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "~/site.config";

export type PageKey = "home" | "owners" | "services" | "stays" | "about" | "contact" | "privacy" | "terms";

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path}`;
}

export function localizedUrl(locale: string, path: string) {
  return absoluteUrl(`/${locale}${path === "/" ? "" : path}`);
}

export async function pageMetadata(locale: string, page: PageKey, path: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)]));

  return {
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: { ...languages, "x-default": localizedUrl(routing.defaultLocale, path) },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: localizedUrl(locale, path),
      siteName: t("siteName"),
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      images: [{ url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: t("defaultTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/og-${locale}.png`],
    },
  };
}

export function localBusinessJsonLd(locale: "ar" | "en") {
  const { contact, social, name } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: name[locale],
    alternateName: name[locale === "ar" ? "en" : "ar"],
    description:
      locale === "ar"
        ? "إدارة وتنظيف الشقق المفروشة للإيجار القصير في أبها"
        : "Short-term rental management and cleaning for furnished apartments in Abha",
    url: localizedUrl(locale, "/"),
    logo: absoluteUrl("/brand/icon-512.png"),
    image: absoluteUrl(`/og/og-${locale}.png`),
    telephone: contact.phone,
    email: contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "ar" ? "أبها" : "Abha",
      addressRegion: locale === "ar" ? "منطقة عسير" : "Asir",
      addressCountry: "SA",
    },
    geo: { "@type": "GeoCoordinates", latitude: contact.geo.lat, longitude: contact.geo.lng },
    areaServed: { "@type": "City", name: locale === "ar" ? "أبها" : "Abha" },
    sameAs: Object.values(social).filter(Boolean),
  };
}
