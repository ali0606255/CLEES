import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="flex min-h-[70vh] items-center bg-sand pb-20 pt-32">
      <div className="container-page text-center">
        <p className="text-7xl font-bold text-primary/15" aria-hidden>
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">{t("body")}</p>
        <ButtonLink href="/" className="mt-8">
          {t("home")}
        </ButtonLink>
      </div>
    </section>
  );
}
