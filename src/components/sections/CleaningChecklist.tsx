import { getTranslations } from "next-intl/server";
import { Bath, Bed, CheckCircle2, Coffee, CookingPot, Sofa } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = [Sofa, Bed, CookingPot, Bath, Coffee];

export async function CleaningChecklist() {
  const t = await getTranslations("services.page");
  const areas = t.raw("checklist") as { area: string; items: string[] }[];

  return (
    <section className="section" aria-labelledby="checklist-title">
      <div className="container-page">
        <SectionHeading id="checklist-title" eyebrow={t("checklistEyebrow")} title={t("checklistTitle")} subtitle={t("checklistSubtitle")} />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {areas.map((area, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={area.area} delay={i * 0.06} className="flex flex-col rounded-[var(--radius-card)] bg-sand p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-white text-primary shadow-sm">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-bold text-ink">{area.area}</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                      <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 fill-accent text-white" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
