# كلييز — Clees

موقع تسويقي ثنائي اللغة (عربي/إنجليزي) لشركة **كلييز** لإدارة وتنظيف الشقق المفروشة للإيجار القصير في أبها.

- **التقنيات:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · next-intl · Framer Motion · React Hook Form + Zod · Resend
- **اللغات:** العربية افتراضياً (`/ar`، من اليمين لليسار) والإنجليزية (`/en`)
- **الصفحات:** الرئيسية، للملاك، خدماتنا، وحداتنا، من نحن، تواصل، سياسة الخصوصية، الشروط والأحكام

---

## 1) التشغيل محلياً

المتطلبات: Node.js 20.9 أو أحدث.

```bash
npm install
cp .env.example .env.local   # ثم عبّ القيم (اختياري للتجربة)
npm run dev                  # http://localhost:3000  ← يحوّلك تلقائياً إلى /ar
```

أوامر مفيدة:

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل بيئة التطوير |
| `npm run build` ثم `npm start` | بناء ونسخة الإنتاج |
| `npm run lint` | فحص الكود |
| `npm run typecheck` | فحص الأنواع (TypeScript) |
| `npm run test:smoke` | اختبار سريع شامل (الحاسبة، النموذج، تبديل اللغة، الفلترة، عدم وجود تمرير أفقي). يحتاج السيرفر شغال، وحدد العنوان: `BASE_URL=http://localhost:3000 npm run test:smoke` |
| `npm run screenshots` | لقطات شاشة للصفحات (جوال 390px وديسكتوب 1440px) في مجلد `screenshots/` |
| `npm run brand` | إعادة توليد الشعار والأيقونات وصور المشاركة (OG) |
| `npm run placeholders` | إعادة توليد الصور المؤقتة |

> لأوامر Playwright: لو ما عندك متصفح مثبت، شغّل `npx playwright install chromium` مرة وحدة.

---

## 2) وين أعدّل إيش؟

### النصوص
كل نصوص الموقع في ملفين:
- `messages/ar.json` — العربي
- `messages/en.json` — الإنجليزي

نفس المفاتيح في الملفين. لو أضفت نص جديد في واحد، أضفه في الثاني. عناوين ووصف كل صفحة لمحركات البحث تحت `meta`.

### بيانات التواصل والإعدادات العامة — `site.config.ts`
- رقم الواتساب والجوال والإيميل وساعات العمل وموقع الخريطة
- روابط السوشال ميديا (لو خليت رابط فاضي `""` يختفي)
- رقم السجل التجاري وترخيص وزارة السياحة والرقم الضريبي (تظهر في الفوتر)
- أرقام شريط الثقة (عدد الوحدات، التقييم، الإشغال)
- `features.showTestimonials` لإظهار/إخفاء قسم آراء العملاء، و`features.showTrustBar` لشريط الأرقام

### المحتوى — مجلد `content/`
| الملف | المحتوى |
|---|---|
| `content/neighborhoods.ts` | الأحياء (الاسم بالعربي والإنجليزي + معامل الطلب في الحاسبة) |
| `content/calculator.ts` | **كل أرقام الحاسبة والمعادلة**: سعر الليلة حسب عدد الغرف، معاملات التأثيث، نسب الإشغال في الموسم وخارجه، نسبة الإدارة… |
| `content/packages.ts` | الباقات: السعر/النسبة والباقة الموصى بها (`recommended`). مميزات كل باقة في ملفات الترجمة تحت `home.packages.items` |
| `content/units.ts` | الوحدات: الاسم، الحي، عدد الغرف والضيوف، الصورة، روابط Airbnb وجاذر إن وBooking (الرابط الفاضي يخفي الزر). `featured: true` يظهرها في الرئيسية |
| `content/testimonials.ts` | آراء العملاء (حقيقية فقط). طالما القائمة فاضية تظهر بطاقات فاضية بملاحظة "تُضاف آراء حقيقية لاحقاً" |

### الصور — `public/images/`
كل الصور الحالية مؤقتة ومكتوب عليها `PLACEHOLDER`. استبدلها **بنفس الاسم** (أو غيّر المسار في الكود/`content/units.ts`):

| الملف | مكانه | المقاس المقترح |
|---|---|---|
| `hero-apartment.jpg` | الهيرو في الرئيسية | 1600×1200 (4:3) |
| `owners-hero.jpg` | أعلى صفحة الملاك | 1600×1200 (4:3) |
| `service-cleaning.jpg` | بطاقة التنظيف | 1200×900 (يُقص 16:9) |
| `service-management.jpg` | بطاقة الإدارة | 1200×900 (يُقص 16:9) |
| `why-abha.jpg` | قسم "ليش أبها" | 1600×1000 (16:10) |
| `about-story.jpg` | صفحة من نحن | 1200×900 (4:3) |
| `unit-01.jpg` … `unit-06.jpg` | بطاقات الوحدات | 1200×900 (4:3) |

نصوص الـ alt للصور في ملفات الترجمة (`imageAlt`) وفي `content/units.ts`.

### الألوان والخطوط — `src/app/globals.css`
كل الألوان متغيرات CSS في أول الملف (`--clees-primary`، `--clees-accent`، …). الخطوط (IBM Plex Sans Arabic وInter) معرفة في `src/app/[locale]/layout.tsx`.

### الشعار
- الملفات الجاهزة: `public/brand/` (`clees-logo.svg`، `clees-logo-white.svg`، `clees-logo-ar.svg`، `clees-logo-ar-white.svg`، `clees-icon.svg`، `icon-192.png`، `icon-512.png`)
- أيقونة المتصفح: `src/app/icon.svg` و`src/app/apple-icon.png`
- صور المشاركة: `public/og/og-ar.png` و`public/og/og-en.png`
- كلها تتولد من `scripts/build-brand.mjs` — عدّل وشغّل `npm run brand`

### النصوص القانونية
`legal.privacy` و`legal.terms` في ملفات الترجمة — **نص قالب لازم يراجعه مختص قانوني**. تاريخ آخر تحديث في `src/components/sections/LegalPage.tsx` (`LAST_UPDATED`).

---

## 3) متغيرات البيئة

انسخ `.env.example` إلى `.env.local` محلياً، وفي Vercel حطها في الإعدادات:

| المتغير | الوصف |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | رابط الموقع النهائي، مثل `https://clees.sa` (للـ SEO والـ sitemap) |
| `RESEND_API_KEY` | مفتاح Resend لإرسال الطلبات على الإيميل. **لو فاضي:** الطلبات ما تفشل، تنطبع في سجل السيرفر (Logs) |
| `LEADS_TO_EMAIL` | الإيميل اللي يستقبل الطلبات (تقدر تحط أكثر من إيميل مفصولة بفاصلة) |
| `LEADS_FROM_EMAIL` | المرسل، لازم من دومين موثّق في Resend. للتجربة: `Clees <onboarding@resend.dev>` |
| `NEXT_PUBLIC_GA_ID` | (اختياري) معرّف Google Analytics 4 مثل `G-XXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | (اختياري) معرّف Meta Pixel |

عند إرسال أي نموذج بنجاح، يتسجل حدث `generate_lead` في GA4 و`Lead` في Meta Pixel (إذا كانوا مفعلين).

**إعداد Resend:** سجّل في [resend.com](https://resend.com) ← Domains ← أضف دومينك ووثّقه بسجلات DNS ← API Keys ← أنشئ مفتاح وحطه في `RESEND_API_KEY`.

**الحماية من السبام:** حقل مخفي (honeypot) + حد 5 طلبات لكل IP كل 10 دقائق (`src/app/api/lead/route.ts`). الحد محفوظ في ذاكرة السيرفر، فهو حماية مبدئية؛ لحماية أقوى استخدم Vercel Firewall أو Upstash Rate Limit.

---

## 4) النشر على Vercel خطوة بخطوة

1. ارفع المشروع على GitHub.
2. ادخل [vercel.com](https://vercel.com) ← **Add New… → Project** ← اختر المستودع.
3. Vercel يتعرف على Next.js تلقائياً — لا تغيّر أوامر البناء.
4. في **Environment Variables** أضف المتغيرات اللي فوق (على الأقل `NEXT_PUBLIC_SITE_URL`، و`RESEND_API_KEY` و`LEADS_TO_EMAIL` و`LEADS_FROM_EMAIL` لاستقبال الإيميلات).
5. اضغط **Deploy**.
6. بعد النشر: **Settings → Domains** ← أضف دومينك (مثل `clees.sa`) واتبع تعليمات الـ DNS.
7. تأكد إن `NEXT_PUBLIC_SITE_URL` يطابق الدومين النهائي، ثم أعد النشر (Redeploy).
8. سجّل الموقع في [Google Search Console](https://search.google.com/search-console) وأرسل `https://دومينك/sitemap.xml`.
9. جرّب نموذج التقييم وتأكد إن الإيميل وصلك (أو شوف **Logs** في Vercel لو ما حطيت مفتاح Resend).

---

## 5) هيكل المشروع

```
site.config.ts            إعدادات عامة (تواصل، سوشال، أرقام قانونية، مفاتيح الأقسام)
content/                  بيانات قابلة للتعديل (أحياء، حاسبة، باقات، وحدات، آراء)
messages/                 النصوص (ar.json / en.json)
public/images/            الصور (مؤقتة حالياً)
public/brand/, public/og/ الشعار والأيقونات وصور المشاركة
scripts/                  توليد الشعار والصور، لقطات الشاشة، اختبار سريع
src/app/[locale]/         الصفحات
src/app/api/lead/         استقبال النماذج وإرسال الإيميل
src/app/sitemap.ts, robots.ts, manifest.ts
src/components/           المكونات (layout / sections / forms / ui / brand)
src/i18n/                 إعداد اللغات والمسارات
src/proxy.ts              توجيه اللغات (Next.js 16 proxy)
```

### SEO المضمّن
عنوان ووصف لكل صفحة باللغتين، `hreflang` وcanonical، Open Graph وTwitter مع صورة مشاركة لكل لغة، `sitemap.xml` و`robots.txt`، JSON-LD من نوع `LocalBusiness` (أبها) و`FAQPage`.

---

## 6) قائمة الـ placeholders اللي لازم تعبيها

**`site.config.ts`**
- [ ] رقم الواتساب `contact.whatsapp` (صيغة دولية: `9665xxxxxxxx`)
- [ ] رقم الجوال `contact.phone` و`contact.phoneDisplay`
- [ ] الإيميل `contact.email`
- [ ] ساعات العمل `contact.hours`
- [ ] روابط السوشال (انستقرام، X، تيك توك، سناب)
- [ ] رقم السجل التجاري، رقم ترخيص وزارة السياحة، الرقم الضريبي (إن وجد)
- [ ] أرقام شريط الثقة: عدد الوحدات، متوسط التقييم، نسبة الإشغال

**`content/`**
- [ ] `calculator.ts`: سعر الليلة لكل عدد غرف، معاملات التأثيث، نسب الإشغال، نسبة الإدارة وتكلفة التنظيف
- [ ] `neighborhoods.ts`: مراجعة الأحياء ومعاملات الطلب
- [ ] `packages.ts`: سعر باقة التنظيف ونسبة باقتي الإدارة
- [ ] `units.ts`: أسماء الوحدات الحقيقية وتفاصيلها وروابط الحجز الفعلية
- [ ] `testimonials.ts`: آراء حقيقية (بموافقة أصحابها)

**`messages/ar.json` و`messages/en.json`**
- [ ] الأسئلة الشائعة: طريقة/دورية تحويل الأرباح `[دوري/شهري]`، مدة العقد `[المدة]`، مدة الإشعار `[مدة الإشعار]`
- [ ] صفحة الملاك: مدة الرد على طلب التقييم `[المدة]`
- [ ] صفحة من نحن: نص القصة (مكتوب عليه "نص مبدئي — عدّله")
- [ ] السياسات: `[الاسم القانوني للشركة]` و`[رقم السجل التجاري]` + مراجعة قانونية كاملة

**الصور والهوية**
- [ ] كل الصور في `public/images/` (12 صورة)
- [ ] مراجعة الشعار (`npm run brand` بعد أي تعديل)

**متغيرات البيئة**
- [ ] `NEXT_PUBLIC_SITE_URL`، `RESEND_API_KEY`، `LEADS_TO_EMAIL`، `LEADS_FROM_EMAIL`
- [ ] (اختياري) `NEXT_PUBLIC_GA_ID`، `NEXT_PUBLIC_META_PIXEL_ID`
