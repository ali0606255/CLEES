import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, subtitle, image, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-sand pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div aria-hidden className="pointer-events-none absolute -end-48 -top-48 size-[36rem] rounded-full bg-[radial-gradient(closest-side,var(--clees-accent-soft),transparent)]" />
      <div className={cn("container-page relative grid items-center gap-10", image && "lg:grid-cols-2 lg:gap-16")}>
        <div className={cn("hero-in", !image && "mx-auto max-w-3xl text-center")}>
          <span className="eyebrow bg-white/80">{eyebrow}</span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.2] tracking-tight text-ink sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">{subtitle}</p> : null}
          {children}
        </div>
        {image ? (
          <div className="hero-in-delayed relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)] ring-1 ring-black/5">
            <Image src={image.src} alt={image.alt} fill preload sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
