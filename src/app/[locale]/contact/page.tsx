import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, whatsappLink } from "~/site.config";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "contact", "/contact");
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const lang = locale as "ar" | "en";
  const { contact } = siteConfig;

  const items = [
    { icon: <BrandIcon name="whatsapp" className="size-5" />, label: t("whatsapp"), value: contact.phoneDisplay, href: whatsappLink(tc("whatsappGreeting")), external: true, ltr: true },
    { icon: <Phone className="size-5" aria-hidden />, label: t("phone"), value: contact.phoneDisplay, href: `tel:${contact.phone}`, ltr: true },
    { icon: <Mail className="size-5" aria-hidden />, label: t("email"), value: contact.email, href: `mailto:${contact.email}` },
    { icon: <MapPin className="size-5" aria-hidden />, label: t("location"), value: contact.city[lang] },
    { icon: <Clock className="size-5" aria-hidden />, label: t("hours"), value: contact.hours[lang] },
  ];

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&hl=${locale}&z=12&output=embed`;

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section pt-12" aria-label={t("formTitle")}>
        <div className="container-page grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Reveal>
              <ul className="divide-y divide-line rounded-[2rem] bg-white ring-1 ring-line">
                {items.map((item) => {
                  const content = (
                    <>
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-primary">{item.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-sm text-muted">{item.label}</span>
                        <span className="block break-words font-semibold text-ink" dir={item.ltr ? "ltr" : undefined} style={item.ltr ? { textAlign: "start" } : undefined}>
                          {item.value}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="flex items-center gap-4 p-5 transition-colors first:rounded-t-[2rem] hover:bg-sand/60"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-5">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="overflow-hidden rounded-[2rem] ring-1 ring-line">
                <iframe
                  title={t("mapTitle")}
                  src={mapSrc}
                  className="block h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <h2 className="mb-5 text-2xl font-bold text-ink">{t("formTitle")}</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
