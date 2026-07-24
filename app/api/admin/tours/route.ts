import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { tourDataFromBody } from "./shared";

// POST (admin) → create a tour.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ ok: false, error: "Name required" }, { status: 422 });

  let slug = body.slug ? slugify(String(body.slug)) : slugify(name);
  if (await prisma.tour.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const created = await prisma.tour.create({ data: { ...tourDataFromBody(body), slug } });
  return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
}
