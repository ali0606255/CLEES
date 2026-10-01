import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  // العربية افتراضية دائماً بغض النظر عن لغة المتصفح
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
