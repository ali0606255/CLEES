/**
 * الأحياء — تُستخدم في الحاسبة والنماذج وفلترة الوحدات.
 * `factor` = معامل الطلب في الحاسبة (1 = متوسط). عدّله حسب خبرتك بالسوق.
 */
export const neighborhoods = [
  { id: "almansak", ar: "المنسك", en: "Al Mansak", factor: 1.05 },
  { id: "alkhalidiyah", ar: "الخالدية", en: "Al Khalidiyah", factor: 1.0 },
  { id: "shamsan", ar: "شمسان", en: "Shamsan", factor: 1.0 },
  { id: "almuwazafeen", ar: "الموظفين", en: "Al Muwazafeen", factor: 0.95 },
  { id: "alnaseem", ar: "النسيم", en: "Al Naseem", factor: 0.95 },
  { id: "almahalah", ar: "المحالة", en: "Al Mahalah", factor: 1.0 },
  { id: "alsoudah", ar: "السودة", en: "Al Soudah", factor: 1.15 },
] as const;

export type NeighborhoodId = (typeof neighborhoods)[number]["id"];

export const neighborhoodIds = neighborhoods.map((n) => n.id) as [NeighborhoodId, ...NeighborhoodId[]];

export function neighborhoodName(id: string, locale: string) {
  const n = neighborhoods.find((x) => x.id === id);
  if (!n) return id;
  return locale === "ar" ? n.ar : n.en;
}
