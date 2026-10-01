import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  tone?: "default" | "light";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, align = "center", tone = "default", as = "h2", className, id }: Props) {
  const H = as;
  return (
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-start", className)}>
      {eyebrow ? (
        <span className={cn("eyebrow", tone === "light" && "!bg-white/10 !text-accent")}>{eyebrow}</span>
      ) : null}
      <H
        id={id}
        className={cn(
          "mt-4 text-balance text-3xl font-bold leading-[1.25] tracking-tight sm:text-4xl",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </H>
      {subtitle ? (
        <p className={cn("mt-4 text-lg leading-relaxed", tone === "light" ? "text-white/80" : "text-muted")}>
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
