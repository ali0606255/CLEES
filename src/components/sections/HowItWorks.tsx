import { getTranslations } from "next-intl/server";
import { Camera, ClipboardCheck, KeyRound, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = [ClipboardCheck, Camera, KeyRound, Wallet];

export async function HowItWorks() {
  const t = await getTranslations("home.how");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <section className="section" aria-labelledby="how-title">
      <div className="container-page">
        <SectionHeading id="how-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden className="absolute inset-x-[12%] top-9 hidden h-px border-t-2 border-dashed border-line lg:block" />
          {steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="relative">
                <div className="h-full rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]">
                  <div className="flex items-center justify-between">
                    <span className="relative grid size-[4.5rem] place-items-center rounded-2xl bg-sand text-primary ring-8 ring-white">
                      <Icon className="size-7" aria-hidden />
                    </span>
                    <span className="text-5xl font-bold text-sand-200" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
