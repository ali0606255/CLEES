import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/icons/BrandIcon";
import type { BrandIconName } from "@/components/icons/brand-paths";
import { siteConfig, whatsappLink } from "~/site.config";
import { navItems } from "./nav-items";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as "ar" | "en";
  const { contact, social, legal } = siteConfig;
  const socials = Object.entries(social).filter(([, url]) => url) as [Exclude<BrandIconName, "whatsapp">, string][];

  return (
    <footer className="bg-primary-800 text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4">
            <Logo variant="latin" tone="white" className="h-8" />
            <span className="h-7 w-px bg-white/20" aria-hidden />
            <Logo variant="arabic" tone="white" className="h-9" />
          </div>
          <p className="mt-5 max-w-sm leading-relaxed text-white/75">{t("about")}</p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-white/90">{t("social")}</p>
            <ul className="mt-3 flex gap-2">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`socialNames.${name}`)}
                    className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-accent hover:text-primary-800"
                  >
                    <BrandIcon name={name} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav aria-label={t("explore")} className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-accent">{t("explore")}</h2>
          <ul className="mt-4 space-y-3">
            {navItems.slice(0, 3).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 transition-colors hover:text-white">
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("company")} className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-accent">{t("company")}</h2>
          <ul className="mt-4 space-y-3">
            {navItems.slice(3).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 transition-colors hover:text-white">
                  {tn(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="text-white/80 transition-colors hover:text-white">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-white/80 transition-colors hover:text-white">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="text-sm font-semibold text-accent">{t("contact")}</h2>
          <ul className="mt-4 space-y-3 text-white/80">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-white">
                <BrandIcon name="whatsapp" className="size-4 shrink-0" />
                <span dir="ltr">{contact.phoneDisplay}</span>
                <span className="sr-only">{tc("whatsappShort")}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-3 hover:text-white">
                <Phone className="size-4 shrink-0" aria-hidden />
                <span dir="ltr">{contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 hover:text-white">
                <Mail className="size-4 shrink-0" aria-hidden />
                {contact.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-3">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {contact.city[locale]}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <dl className="flex flex-wrap gap-x-6 gap-y-1">
            <div className="flex gap-1.5">
              <dt>{t("cr")}:</dt>
              <dd className="text-white/85">{legal.commercialRegistration}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>{t("license")}:</dt>
              <dd className="text-white/85">{legal.tourismLicense}</dd>
            </div>
            {legal.vatNumber ? (
              <div className="flex gap-1.5">
                <dt>{t("vat")}:</dt>
                <dd className="text-white/85">{legal.vatNumber}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </footer>
  );
}
