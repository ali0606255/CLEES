import { neighborhoods } from "./neighborhoods";

/**
 * 🧮 إعدادات حاسبة الدخل المتوقع
 *
 * ⚠️ كل الأرقام هنا افتراضات مبدئية (placeholders) للتوضيح فقط —
 * استبدلها ببيانات السوق الحقيقية في أبها قبل الإطلاق.
 *
 * المعادلة:
 *   سعر الليلة = baseNightly[عدد الغرف] × معامل التأثيث × معامل الحي × معامل الموسم
 *   الدخل الشهري الإجمالي = سعر الليلة × أيام الشهر × نسبة الإشغال
 *   صافي المالك = الإجمالي × (1 - نسبة الإدارة) - تكاليف التنظيف التقديرية
 *   النتيجة تُعرض كنطاق (± rangeSpread) وتُقرَّب لأقرب roundTo.
 */
export const calculatorConfig = {
  currency: { ar: "ريال", en: "SAR" },
  daysPerMonth: 30,

  bedrooms: [1, 2, 3, 4] as const,
  /** سعر الليلة الأساسي (ريال) حسب عدد الغرف — [placeholder] */
  baseNightly: { 1: 250, 2: 350, 3: 450, 4: 550 } as Record<number, number>,

  furnishing: [
    { id: "basic", multiplier: 0.9 },
    { id: "good", multiplier: 1.0 },
    { id: "premium", multiplier: 1.2 },
  ] as const,

  seasons: {
    /** موسم الصيف والإجازات — [placeholder] */
    high: { priceMultiplier: 1.4, occupancy: 0.8 },
    /** بقية السنة — [placeholder] */
    low: { priceMultiplier: 0.85, occupancy: 0.45 },
  },

  /** متوسط مدة الإقامة بالليالي (لتقدير عدد مرات التنظيف) — [placeholder] */
  avgStayNights: 2.5,
  /** تكلفة التنظيف التقديرية لكل مغادرة (ريال) — [placeholder] */
  cleaningCostPerTurnover: 0,
  /** نسبة إدارة كلييز المستخدمة في حساب الصافي (0.2 = 20٪) — [placeholder]. خلّها 0 لعرض الإجمالي فقط */
  managementFee: 0,

  rangeSpread: 0.12,
  roundTo: 100,
};

export type FurnishingId = (typeof calculatorConfig.furnishing)[number]["id"];

export function estimateIncome(input: { neighborhood: string; bedrooms: number; furnishing: string }) {
  const c = calculatorConfig;
  const base = c.baseNightly[input.bedrooms] ?? c.baseNightly[1];
  const furn = c.furnishing.find((f) => f.id === input.furnishing)?.multiplier ?? 1;
  const hood = neighborhoods.find((n) => n.id === input.neighborhood)?.factor ?? 1;

  const season = (s: { priceMultiplier: number; occupancy: number }) => {
    const nightly = base * furn * hood * s.priceMultiplier;
    const nights = c.daysPerMonth * s.occupancy;
    const gross = nightly * nights;
    const turnovers = nights / c.avgStayNights;
    const net = gross * (1 - c.managementFee) - turnovers * c.cleaningCostPerTurnover;
    const round = (v: number) => Math.max(0, Math.round(v / c.roundTo) * c.roundTo);
    return {
      min: round(net * (1 - c.rangeSpread)),
      max: round(net * (1 + c.rangeSpread)),
      occupancy: s.occupancy,
      nightly: Math.round(nightly),
    };
  };

  return { high: season(c.seasons.high), low: season(c.seasons.low) };
}
