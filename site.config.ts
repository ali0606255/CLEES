/**
 * ⚙️ إعدادات الموقع العامة — عدّل القيم هنا فقط.
 * كل قيمة بين [أقواس مربعة] هي placeholder لازم تستبدلها بالقيمة الحقيقية.
 */
export const siteConfig = {
  name: { ar: "كلييز", en: "Clees" },
  // الدومين النهائي (بدون / في النهاية). يُقرأ من متغير البيئة أولاً.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://clees.sa",

  contact: {
    // رقم الواتساب بالصيغة الدولية بدون + أو أصفار بادئة
    whatsapp: "966500000000", // [رقم الواتساب]
    phone: "+966500000000", // [رقم الجوال]
    phoneDisplay: "050 000 0000", // [رقم الجوال كما يظهر للزوار]
    email: "hello@clees.sa", // [الإيميل]
    city: { ar: "أبها، منطقة عسير", en: "Abha, Asir Region" },
    // يظهر في الخريطة وفي JSON-LD
    geo: { lat: 18.2164, lng: 42.5053 },
    mapQuery: "Abha, Saudi Arabia",
    hours: { ar: "يومياً 9ص – 11م", en: "Daily 9am – 11pm" }, // [ساعات العمل]
  },

  social: {
    instagram: "https://instagram.com/clees.sa", // [رابط انستقرام]
    x: "https://x.com/clees_sa", // [رابط X]
    tiktok: "https://tiktok.com/@clees.sa", // [رابط تيك توك]
    snapchat: "https://snapchat.com/add/clees.sa", // [رابط سناب شات]
  },

  legal: {
    commercialRegistration: "[رقم السجل التجاري]",
    tourismLicense: "[رقم ترخيص وزارة السياحة]",
    vatNumber: "", // اتركه فاضي إذا ما ينطبق
  },

  features: {
    // خلّه true بعد ما تضيف آراء حقيقية في content/testimonials.ts
    showTestimonials: true,
    // يظهر شريط الأرقام فقط إذا true
    showTrustBar: true,
  },

  // أرقام شريط الثقة — كلها placeholders، عدّلها بأرقامك الحقيقية
  trustStats: [
    { key: "units", value: "[00]+" },
    { key: "rating", value: "[4.9]" },
    { key: "occupancy", value: "[00]%" },
    { key: "support", value: "24/7" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
