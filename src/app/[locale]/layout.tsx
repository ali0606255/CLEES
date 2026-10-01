import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Analytics } from "@/components/layout/Analytics";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { revealScript } from "@/lib/reveal-script";
import { localBusinessJsonLd } from "@/lib/seo";
import { siteConfig } from "~/site.config";
import "../globals.css";

// Arabic glyphs only — Latin text and digits fall back to Inter (see --font-sans in globals.css)
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F3D3E",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    applicationName: t("siteName"),
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Only send the namespaces used by client components to the browser
  const all = await getMessages();
  const clientMessages = {
    nav: all.nav,
    common: all.common,
    form: all.form,
    stays: all.stays,
    home: { calculator: (all.home as Record<string, unknown>).calculator },
  };

  return (
    <html lang={locale} suppressHydrationWarning dir={locale === "ar" ? "rtl" : "ltr"} className={`${plexArabic.variable} ${inter.variable}`}>
      <head>
        {/* Marks JS as available so scroll-reveal styles only apply when they can be undone */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <WhatsAppFloat />
            <RevealObserver />
          </MotionProvider>
        </NextIntlClientProvider>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale)) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
