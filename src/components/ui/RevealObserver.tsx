"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Re-scans after client-side navigation. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    (window as unknown as { __cleesReveal?: () => void }).__cleesReveal?.();
  }, [pathname]);
  return null;
}
