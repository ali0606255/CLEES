import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { units } from "~/content/units";
import { UnitCard } from "./UnitCard";

export async function FeaturedUnits() {
  const t = await getTranslations("home.units");
  const tc = await getTranslations("common");
  const featured = units.filter((u) => u.featured).slice(0, 6);
  const list = featured.length ? featured : units.slice(0, 3);

  return (
    <section className="section bg-sand" aria-labelledby="units-title">
      <div className="container-page">
        <SectionHeading id="units-title" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((u, i) => (
            <Reveal as="li" key={u.id} delay={i * 0.06}>
              <UnitCard unit={u} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <ButtonLink href="/stays" variant="secondary">
            {tc("viewAll")}
            <ArrowLeft className="size-4 ltr:-scale-x-100" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
