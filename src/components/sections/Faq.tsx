import { getTranslations } from "next-intl/server";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { Accordion } from "@/components/ui/Accordion";
import { ExternalButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { whatsappLink } from "~/site.config";

export async function Faq() {
  const t = await getTranslations("home.faq");
  const tc = await getTranslations("common");
  const items = t.raw("items") as { q: string; a: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };

  return (
    <section id="faq" className="section bg-sand" aria-labelledby="faq-title">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <span className="eyebrow bg-white">{t("eyebrow")}</span>
          <h2 id="faq-title" className="mt-4 text-3xl font-bold leading-[1.25] tracking-tight text-ink sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{t("subtitle")}</p>
          <ExternalButton href={whatsappLink(tc("whatsappGreeting"))} variant="whatsapp" className="mt-7">
            <BrandIcon name="whatsapp" className="size-5" />
            {tc("whatsapp")}
            <span className="sr-only">{tc("opensNewTab")}</span>
          </ExternalButton>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={0.08}>
          <Accordion items={items} />
        </Reveal>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
