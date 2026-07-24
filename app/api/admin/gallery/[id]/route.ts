import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const body = (await request.json().catch(() => ({}))) as {
    caption?: string; category?: string; sortOrder?: number;
  };
  const updated = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...(body.caption !== undefined ? { caption: body.caption || null } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
    },
  });
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
