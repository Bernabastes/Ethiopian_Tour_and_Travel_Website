import { AdminShell } from "@/components/admin/AdminShell";
import { BookingsTable, type BookingRow } from "@/components/admin/BookingsTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getBookings(): Promise<BookingRow[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((b) => ({
      id: b.id,
      reference: b.reference,
      fullName: b.fullName,
      email: b.email,
      phone: b.phone,
      country: b.country,
      tourName: b.tourName,
      travelDate: b.travelDate.toISOString(),
      adults: b.adults,
      children: b.children,
      infants: b.infants,
      totalUsd: b.totalUsd,
      depositUsd: b.depositUsd,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[ADMIN] bookings query failed:", err);
    return null;
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <AdminShell title="Bookings">
      {bookings === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">
          Database not connected yet. Set <code className="rounded bg-black/5 px-1">DATABASE_URL</code> and run the migrate + seed scripts.
        </div>
      ) : (
        <BookingsTable initial={bookings} />
      )}
    </AdminShell>
  );
}
