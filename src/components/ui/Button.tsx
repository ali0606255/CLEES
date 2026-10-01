import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "dark" | "ghost" | "whatsapp" | "outlineLight";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-primary-800 hover:bg-[#5be5a9] shadow-[0_8px_20px_-10px_rgb(61_220_151/0.9)]",
  secondary: "bg-white text-primary ring-1 ring-inset ring-line hover:ring-primary/40 hover:bg-sand",
  dark: "bg-primary text-white hover:bg-primary-600",
  ghost: "text-primary hover:bg-sand",
  whatsapp: "bg-[#167a40] text-white hover:bg-[#12663a]",
  outlineLight: "text-white ring-1 ring-inset ring-white/40 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type LinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant, size, className, ...props }: LinkProps) {
  return <Link {...props} className={buttonClasses(variant, size, className)} />;
}

type ExternalProps = ComponentProps<"a"> & { variant?: Variant; size?: Size };

export function ExternalButton({ variant, size, className, ...props }: ExternalProps) {
  return <a target="_blank" rel="noopener noreferrer" {...props} className={buttonClasses(variant, size, className)} />;
}
