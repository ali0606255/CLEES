/**
 * 💬 آراء العملاء — أضف آراء حقيقية فقط (بموافقة أصحابها).
 * طالما القائمة فاضية، يظهر القسم ببطاقات فاضية مع ملاحظة "تُضاف آراء حقيقية لاحقاً".
 * لإخفاء القسم كاملاً: siteConfig.features.showTestimonials = false
 */
export type Testimonial = {
  quote: { ar: string; en: string };
  name: { ar: string; en: string };
  role: { ar: string; en: string }; // مثال: "مالك شقة — المنسك"
  rating?: number;
};

export const testimonials: Testimonial[] = [];
