import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  if (!String(b.name ?? "").trim() || !String(b.text ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "Name and text required" }, { status: 422 });
  }

  const created = await prisma.review.create({
    data: {
      name: String(b.name),
      country: String(b.country ?? ""),
      countryFlag: String(b.countryFlag ?? "🌍"),
      rating: Math.min(5, Math.max(1, Number(b.rating) || 5)),
      tour: String(b.tour ?? ""),
      text: String(b.text),
      date: b.date ? new Date(String(b.date)) : new Date(),
      approved: b.approved !== undefined ? Boolean(b.approved) : true,
    },
  });
  return NextResponse.json({ ok: true, id: created.id });
}
