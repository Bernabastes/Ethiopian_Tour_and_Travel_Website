import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { destinationDataFrom } from "../shared";

async function guard() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = { ...destinationDataFrom(b) };
  if (b.slug) data.slug = slugify(String(b.slug));
  const updated = await prisma.destination.update({ where: { id }, data });
  return NextResponse.json({ ok: true, slug: updated.slug });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  await prisma.destination.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
