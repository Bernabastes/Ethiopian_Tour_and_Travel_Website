"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours & Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header({ linkPrefetch = true }: { linkPrefetch?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const prefetch = linkPrefetch;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/80 shadow-card backdrop-blur-md supports-[backdrop-filter]:bg-cream/70"
          : "bg-transparent"
      }`}
    >
      <nav className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href="/" prefetch={prefetch} aria-label="Habesha Heritage Tours — home" className="shrink-0">
          {/* Dark logo for light/scrolled bg; switches via CSS on transparent hero */}
          <Image
            src={scrolled ? "/logo-dark.svg" : "/logo-light.svg"}
            alt="Habesha Heritage Tours"
            width={200}
            height={43}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={prefetch}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    scrolled ? "text-ink/80" : "text-white drop-shadow"
                  } ${
                    active
                      ? scrolled
                        ? "text-brand-green underline decoration-brand-gold decoration-2 underline-offset-8"
                        : "text-brand-gold underline decoration-brand-gold decoration-2 underline-offset-8"
                      : "hover:text-brand-gold"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/book" className="btn-primary hidden px-4 text-sm sm:inline-flex">
            Book Now
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md lg:hidden ${
              scrolled ? "text-ink" : "text-white"
            }`}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-black/5 bg-cream/95 backdrop-blur-md lg:hidden">
          <ul className="container-page flex flex-col py-3">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={prefetch}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-md px-3 py-3 text-base font-semibold ${
                      active ? "bg-brand-green/10 text-brand-green" : "text-ink/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="px-3 pt-2">
              <Link href="/book" className="btn-primary w-full">
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
