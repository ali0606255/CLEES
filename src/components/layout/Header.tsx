"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on route change
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const focusables = panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-white"
      >
        {t("skip")}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300",
          solid ? "bg-white/95 shadow-[0_6px_24px_-14px_rgb(20_24_31/0.25)] backdrop-blur" : "bg-transparent",
        )}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="shrink-0 rounded-lg" aria-label={locale === "ar" ? "كلييز — الرئيسية" : "Clees — Home"}>
            <Logo variant={locale === "ar" ? "arabic" : "latin"} className={locale === "ar" ? "h-10" : "h-8"} />
          </Link>

          <nav aria-label={t("mainNav")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors hover:bg-sand hover:text-primary",
                        active ? "text-primary" : "text-ink/80",
                      )}
                    >
                      {t(item.key)}
                      {active && (
                        <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ButtonLink href="/owners#evaluate" size="sm" className="px-3.5 sm:px-4">
              {t("evaluate")}
            </ButtonLink>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("closeMenu") : t("openMenu")}
              className="grid size-11 place-items-center rounded-full text-primary transition-colors hover:bg-sand lg:hidden"
            >
              {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {open && (
          <div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={t("mainNav")}
            className="menu-in fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-white lg:hidden"
          >
            <nav className="container-page flex min-h-full flex-col pb-8 pt-4">
              <ul className="flex flex-col">
                {[{ href: "/", key: "home" } as const, ...navItems].map((item, i) => (
                  <li key={item.href} className="menu-item-in" style={{ animationDelay: `${0.04 * i}s` }}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between border-b border-line py-4 text-xl font-semibold",
                        pathname === item.href ? "text-primary" : "text-ink",
                      )}
                    >
                      {t(item.key)}
                      {pathname === item.href && <span className="size-2 rounded-full bg-accent" aria-hidden />}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <ButtonLink href="/owners#evaluate" size="lg" onClick={() => setOpen(false)}>
                  {t("evaluate")}
                </ButtonLink>
                <LanguageSwitcher className="justify-center ring-1 ring-line" />
              </div>
            </nav>
          </div>
        )}
    </>
  );
}
