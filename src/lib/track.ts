/** Fire a conversion event to whichever analytics are enabled (GA4 / Meta Pixel). */
export function trackLead(kind: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
  w.gtag?.("event", "generate_lead", { form: kind });
  w.fbq?.("track", "Lead", { form: kind });
}
