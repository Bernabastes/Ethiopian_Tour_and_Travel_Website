import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  LayoutDashboard, CalendarRange, Inbox, MessageSquare,
  Map, MapPin, Users, Star, Newspaper, ImageIcon,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Operations" },
  { href: "/admin/bookings", label: "Bookings", icon: Inbox, group: "Operations" },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, group: "Operations" },
  { href: "/admin/availability", label: "Availability", icon: CalendarRange, group: "Operations" },
  { href: "/admin/tours", label: "Tours", icon: Map, group: "Content" },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin, group: "Content" },
  { href: "/admin/guides", label: "Guides", icon: Users, group: "Content" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, group: "Content" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, group: "Content" },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon, group: "Content" },
];

export async function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Sidebar */}
      <aside className="bg-brand-green-dark text-white lg:fixed lg:inset-y-0 lg:w-60">
        <div className="flex items-center gap-2 px-5 py-5">
          <Image src="/logo-light.svg" alt="Admin" width={160} height={34} className="h-8 w-auto" />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
          {["Operations", "Content"].map((group) => (
            <div key={group} className="contents lg:block">
              <p className="hidden px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-white/40 lg:block">
                {group}
              </p>
              {nav.filter((n) => n.group === group).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="hidden px-3 lg:absolute lg:inset-x-0 lg:bottom-4 lg:block">
          <p className="px-3 pb-1 text-xs text-white/40">{session.user?.email}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 lg:ml-60">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
          <h1 className="font-heading text-xl text-brand-green-dark">{title}</h1>
          <Link href="/" className="text-sm text-ink/60 hover:text-brand-green">View site →</Link>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
