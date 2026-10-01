import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
};

/**
 * Subtle fade-up when scrolled into view. Server component: a single shared
 * <RevealObserver /> (in the layout) toggles `.is-visible`, so there is no per-element hydration.
 * Content stays visible without JS and for users who prefer reduced motion (see globals.css).
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: Props) {
  return (
    // The inline reveal script may add `is-visible` before hydration
    <Tag suppressHydrationWarning className={cn("reveal", className)} style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
