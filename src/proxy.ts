import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // كل المسارات ما عدا الـ API وملفات Next الداخلية والملفات الثابتة
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
