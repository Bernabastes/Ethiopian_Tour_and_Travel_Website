import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { GuideEditor, type GuideDraft } from "@/components/admin/GuideEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) notFound();
  const g = await prisma.guide.findUnique({ where: { id } });
  if (!g) notFound();

  const draft: GuideDraft = {
    id: g.id, name: g.name, slug: g.slug, title: g.title, yearsExperience: g.yearsExperience,
    licenseNumber: g.licenseNumber, specialties: arr<string>(g.specialties),
    languages: arr<string>(g.languages), bio: g.bio, rating: g.rating, image: g.image,
  };

  return (
    <AdminShell title="Edit guide">
      <GuideEditor initial={draft} />
    </AdminShell>
  );
}
