import { brandPaths, type BrandIconName } from "./brand-paths";

export function BrandIcon({ name, className, title }: { name: BrandIconName; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <path d={brandPaths[name]} />
    </svg>
  );
}
