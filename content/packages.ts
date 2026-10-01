/**
 * الباقات — النصوص في messages/*.json تحت home.packages.items.<id>
 * السعر/النسبة هنا placeholders واضحة.
 */
export const packages = [
  { id: "cleaning", price: { ar: "[السعر] ريال", en: "SAR [price]" }, unit: "perVisit", recommended: false },
  { id: "management", price: { ar: "[النسبة]٪", en: "[rate]%" }, unit: "ofRevenue", recommended: true },
  { id: "management_plus", price: { ar: "[النسبة]٪", en: "[rate]%" }, unit: "ofRevenue", recommended: false },
] as const;

export type PackageId = (typeof packages)[number]["id"];
export const serviceIds = ["cleaning", "management", "management_plus", "not_sure"] as const;
export type ServiceId = (typeof serviceIds)[number];
