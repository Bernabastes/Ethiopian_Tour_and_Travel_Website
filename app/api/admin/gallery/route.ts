import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST (admin) → add a gallery image record.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    url?: string; caption?: string; category?: string;
  };
  if (!body.url) return NextResponse.json({ ok: false, error: "url required" }, { status: 422 });

  const max = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });
  const created = await prisma.galleryImage.create({
    data: {
      url: body.url,
      caption: body.caption || null,
      category: body.category || "Landscapes",
      sortOrder: (max._max.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json({ ok: true, item: created });
}
