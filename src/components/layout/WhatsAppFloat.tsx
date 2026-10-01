import { getTranslations } from "next-intl/server";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { whatsappLink } from "~/site.config";

export async function WhatsAppFloat() {
  const t = await getTranslations("common");
  return (
    <a
      href={whatsappLink(t("whatsappGreeting"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t("whatsappFloat")} ${t("opensNewTab")}`}
      className="group fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full bg-[#167a40] p-3.5 text-white shadow-[0_12px_30px_-10px_rgb(22_122_64/0.7)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#12663a] sm:bottom-7 sm:end-7"
    >
      <BrandIcon name="whatsapp" className="size-7" />
      <span className="hidden pe-1 text-sm font-semibold md:inline">{t("whatsappShort")}</span>
    </a>
  );
}
