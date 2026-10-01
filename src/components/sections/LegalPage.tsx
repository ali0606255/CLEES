import { getTranslations } from "next-intl/server";
import { Info } from "lucide-react";
import { siteConfig } from "~/site.config";

/** Update this date whenever the legal text changes */
const LAST_UPDATED = "2026-10-01";

export async function LegalPage({ doc, locale }: { doc: "privacy" | "terms"; locale: string }) {
  const t = await getTranslations("legal");
  const sections = t.raw(`${doc}.sections`) as { title: string; body: string[] }[];
  const fill = (s: string) => s.replaceAll("{email}", siteConfig.contact.email);
  const date = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", { dateStyle: "long" }).format(new Date(LAST_UPDATED));

  return (
    <article className="bg-white pb-20 pt-32 sm:pt-36">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">{t(`${doc}.title`)}</h1>
        <p className="mt-3 text-sm text-muted">{t("updated", { date })}</p>
        <p className="mt-6 flex items-start gap-2 rounded-xl bg-[#fffaeb] px-4 py-3 text-sm font-semibold text-[#7a4b00]">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {t("templateNote")}
        </p>
        <p className="mt-8 text-lg leading-loose text-ink/90">{t(`${doc}.intro`)}</p>
        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-ink">{s.title}</h2>
              {s.body.length > 1 ? (
                <ul className="mt-4 list-disc space-y-2 ps-6 leading-loose text-ink/85 marker:text-primary">
                  {s.body.map((b) => (
                    <li key={b}>{fill(b)}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 leading-loose text-ink/85">{fill(s.body[0])}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
