/**
 * 🏠 الوحدات النموذجية — عدّل/أضف/احذف حسب وحداتك الحقيقية.
 * الصور في public/images — استبدلها بنفس الاسم أو غيّر المسار هنا.
 * أي رابط فاضي "" يخفي زر الحجز الخاص فيه.
 */
import type { NeighborhoodId } from "./neighborhoods";

export type Unit = {
  id: string;
  name: { ar: string; en: string };
  neighborhood: NeighborhoodId;
  bedrooms: number;
  guests: number;
  image: string;
  imageAlt: { ar: string; en: string };
  links: { airbnb: string; gathern: string; booking: string };
  featured?: boolean;
};

export const units: Unit[] = [
  {
    id: "unit-01",
    name: { ar: "[اسم الوحدة ١] — شقة الإطلالة", en: "[Unit 1] — The View Apartment" },
    neighborhood: "almansak",
    bedrooms: 2,
    guests: 4,
    image: "/images/unit-01.jpg",
    imageAlt: { ar: "صالة شقة مفروشة بإطلالة على جبال أبها", en: "Furnished living room with a view of Abha's mountains" },
    links: { airbnb: "https://www.airbnb.com/", gathern: "https://gathern.co/", booking: "" },
    featured: true,
  },
  {
    id: "unit-02",
    name: { ar: "[اسم الوحدة ٢] — جناح الضباب", en: "[Unit 2] — The Fog Suite" },
    neighborhood: "alsoudah",
    bedrooms: 1,
    guests: 2,
    image: "/images/unit-02.jpg",
    imageAlt: { ar: "غرفة نوم مرتبة بمفارش بيضاء", en: "Tidy bedroom with fresh white linen" },
    links: { airbnb: "https://www.airbnb.com/", gathern: "https://gathern.co/", booking: "" },
    featured: true,
  },
  {
    id: "unit-03",
    name: { ar: "[اسم الوحدة ٣] — شقة العائلة", en: "[Unit 3] — The Family Flat" },
    neighborhood: "alkhalidiyah",
    bedrooms: 3,
    guests: 6,
    image: "/images/unit-03.jpg",
    imageAlt: { ar: "مطبخ مجهز ونظيف في شقة عائلية", en: "Clean, fully equipped kitchen in a family apartment" },
    links: { airbnb: "https://www.airbnb.com/", gathern: "https://gathern.co/", booking: "" },
    featured: true,
  },
  {
    id: "unit-04",
    name: { ar: "[اسم الوحدة ٤] — استوديو شمسان", en: "[Unit 4] — Shamsan Studio" },
    neighborhood: "shamsan",
    bedrooms: 1,
    guests: 2,
    image: "/images/unit-04.jpg",
    imageAlt: { ar: "غرفة نوم هادئة بإضاءة طبيعية", en: "Calm bedroom with natural light" },
    links: { airbnb: "https://www.airbnb.com/", gathern: "https://gathern.co/", booking: "" },
  },
  {
    id: "unit-05",
    name: { ar: "[اسم الوحدة ٥] — شقة النسيم", en: "[Unit 5] — Al Naseem Apartment" },
    neighborhood: "alnaseem",
    bedrooms: 2,
    guests: 4,
    image: "/images/unit-05.jpg",
    imageAlt: { ar: "صالة واسعة بكنب مريح ونباتات", en: "Spacious living room with a comfy sofa and plants" },
    links: { airbnb: "https://www.airbnb.com/", gathern: "https://gathern.co/", booking: "" },
  },
  {
    id: "unit-06",
    name: { ar: "[اسم الوحدة ٦] — شقة المحالة", en: "[Unit 6] — Al Mahalah Apartment" },
    neighborhood: "almahalah",
    bedrooms: 3,
    guests: 6,
    image: "/images/unit-06.jpg",
    imageAlt: { ar: "مطبخ مفتوح مرتب بأدوات ضيافة", en: "Tidy open kitchen with hospitality essentials" },
    links: { airbnb: "https://www.airbnb.com/", gathern: "https://gathern.co/", booking: "" },
  },
];
