import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { destinationDataFrom } from "./shared";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  if (!String(b.name ?? "").trim()) return NextResponse.json({ ok: false, error: "Name required" }, { status: 422 });

  let slug = b.slug ? slugify(String(b.slug)) : slugify(String(b.name));
  if (await prisma.destination.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const created = await prisma.destination.create({ data: { ...destinationDataFrom(b), slug } });
  return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
}
