import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Western digits in both locales for readability of prices and phone numbers */
export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US").format(value);
}

/** Converts Arabic-Indic / Persian digits to ASCII digits and strips spaces/dashes */
export function normalizeDigits(input: string) {
  return input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\s-]/g, "");
}

export function normalizeSaudiPhone(input: string) {
  let v = normalizeDigits(input);
  if (v.startsWith("+966")) v = "0" + v.slice(4);
  else if (v.startsWith("00966")) v = "0" + v.slice(5);
  else if (v.startsWith("966")) v = "0" + v.slice(3);
  else if (v.startsWith("5") && v.length === 9) v = "0" + v;
  return v;
}
