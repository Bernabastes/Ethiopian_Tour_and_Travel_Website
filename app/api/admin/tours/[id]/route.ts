import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { tourDataFromBody } from "../shared";

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
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const data = tourDataFromBody(body);
  const patch: Record<string, unknown> = { ...data };
  if (body.slug) patch.slug = slugify(String(body.slug));

  const updated = await prisma.tour.update({ where: { id }, data: patch });
  return NextResponse.json({ ok: true, slug: updated.slug });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  await prisma.tour.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
