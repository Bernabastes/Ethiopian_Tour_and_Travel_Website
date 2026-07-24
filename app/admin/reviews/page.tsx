import { AdminShell } from "@/components/admin/AdminShell";
import { ReviewsManager } from "@/components/admin/ReviewsManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getRows() {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return null;
  }
}

export default async function AdminReviewsPage() {
  const rows = await getRows();
  return (
    <AdminShell title="Reviews">
      {rows === null ? (
        <div className="card p-10 text-center text-sm text-ink/60">Database not connected.</div>
      ) : (
        <ReviewsManager
          initial={rows.map((r) => ({
            id: r.id, name: r.name, country: r.country, countryFlag: r.countryFlag,
            rating: r.rating, tour: r.tour, text: r.text, approved: r.approved,
            date: r.date.toISOString(),
          }))}
        />
      )}
    </AdminShell>
  );
}
