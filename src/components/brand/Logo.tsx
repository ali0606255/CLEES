import { ARABIC, LATIN } from "./logo-paths";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "latin" | "arabic";
  tone?: "color" | "white";
  className?: string;
  title?: string;
};

/** Clees wordmark — geometric monoline "clees" or the Arabic "كلييز", each with the cleanliness sparkle. */
export function Logo({ variant = "latin", tone = "color", className, title }: Props) {
  const ink = tone === "white" ? "#FFFFFF" : "var(--clees-primary)";
  const spark = "var(--clees-accent)";
  const label = title ?? (variant === "arabic" ? "كلييز" : "Clees");

  if (variant === "arabic") {
    return (
      <svg viewBox={ARABIC.viewBox} className={cn("h-9 w-auto", className)} role="img" aria-label={label}>
        <path d={ARABIC.glyphs} fill={ink} stroke={ink} strokeWidth={22} strokeLinejoin="round" />
        <path d={ARABIC.sparkle} fill={spark} />
      </svg>
    );
  }
  return (
    <svg viewBox={LATIN.viewBox} className={cn("h-8 w-auto", className)} role="img" aria-label={label}>
      <path
        d={LATIN.strokes}
        fill="none"
        stroke={ink}
        strokeWidth={LATIN.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={LATIN.sparkle} fill={spark} />
    </svg>
  );
}
