import Link from "next/link";
import { Inbox, Clock, CheckCircle2, DollarSign, MessageSquare, Database } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const [total, pending, confirmed, paidAgg, newMessages, recent] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.aggregate({ _sum: { totalUsd: true }, where: { status: { in: ["CONFIRMED", "PAID"] } } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    return {
      total,
      pending,
      confirmed,
      revenue: paidAgg._sum.totalUsd ?? 0,
      newMessages,
      recent,
    };
  } catch (err) {
    console.error("[ADMIN] stats query failed:", err);
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <AdminShell title="Dashboard">
      {!stats ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <Database size={40} className="text-brand-green" />
          <h2 className="text-xl font-bold">Connect your database</h2>
          <p className="max-w-md text-sm text-ink/60">
            Set <code className="rounded bg-black/5 px-1">DATABASE_URL</code> in <code>.env</code>,
            then run <code className="rounded bg-black/5 px-1">npm run db:migrate</code> and{" "}
            <code className="rounded bg-black/5 px-1">npm run db:seed</code>. Bookings and messages
            will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total bookings", value: stats.total, icon: Inbox, color: "text-brand-green" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600" },
              { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, color: "text-brand-green" },
              { label: "Booked value", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-brand-gold-dark" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <Icon size={22} className={color} />
                <p className="mt-3 text-2xl font-bold">{value}</p>
                <p className="text-sm text-ink/55">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-lg text-brand-green-dark">Recent bookings</h2>
                <Link href="/admin/bookings" className="text-sm text-brand-green hover:underline">View all</Link>
              </div>
              {stats.recent.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink/50">No bookings yet.</p>
              ) : (
                <ul className="divide-y divide-black/5">
                  {stats.recent.map((b) => (
                    <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                      <span>
                        <span className="font-medium">{b.fullName}</span>
                        <span className="block text-xs text-ink/50">{b.tourName}</span>
                      </span>
                      <span className="text-right">
                        <span className="font-semibold">${b.totalUsd.toLocaleString()}</span>
                        <span className="block text-xs text-ink/50">#{b.reference}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link href="/admin/messages" className="card flex items-center gap-4 p-5 hover:shadow-card-hover">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <MessageSquare size={22} />
              </span>
              <span>
                <span className="block text-2xl font-bold">{stats.newMessages}</span>
                <span className="text-sm text-ink/55">New messages</span>
              </span>
            </Link>
          </div>
        </>
      )}
    </AdminShell>
  );
}
