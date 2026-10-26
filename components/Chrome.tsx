"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

type FooterLink = { slug: string; name: string };

// Wraps public pages with the marketing chrome (nav/footer/WhatsApp), but renders
// admin pages bare so the dashboard gets its own full-screen layout.
export function Chrome({
  children,
  popularTours,
  topDestinations,
}: {
  children: React.ReactNode;
  // Footer link data, fetched server-side in the layout and forwarded to Footer.
  popularTours: FooterLink[];
  topDestinations: FooterLink[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPaymentResult = pathname?.startsWith("/book/success");

  if (isAdmin) return <>{children}</>;

  // Payment result — minimal shell (no nav/footer) to avoid prefetching the heavy
  // home page via header links while modules are still compiling in dev.
  if (isPaymentResult) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="flex h-[var(--header-h)] items-center justify-center border-b border-black/5">
          <Link href="/" aria-label="Habesha Heritage Tours — home">
            <Image
              src="/logo-dark.svg"
              alt="Habesha Heritage Tours"
              width={180}
              height={39}
              className="h-9 w-auto"
            />
          </Link>
        </div>
        <main>{children}</main>
      </div>
    );
  }

  const linkPrefetch = pathname != null && !pathname.startsWith("/book");

  return (
    <>
      <Header linkPrefetch={linkPrefetch} />
      <main className="min-h-screen">{children}</main>
      <Footer
        popularTours={popularTours}
        topDestinations={topDestinations}
        linkPrefetch={linkPrefetch}
      />
      <FloatingWhatsApp />
    </>
  );
}
