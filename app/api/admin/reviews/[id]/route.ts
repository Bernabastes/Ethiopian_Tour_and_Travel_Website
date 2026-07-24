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
  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (b.approved !== undefined) data.approved = Boolean(b.approved);
  if (b.name !== undefined) data.name = String(b.name);
  if (b.country !== undefined) data.country = String(b.country);
  if (b.countryFlag !== undefined) data.countryFlag = String(b.countryFlag);
  if (b.rating !== undefined) data.rating = Math.min(5, Math.max(1, Number(b.rating) || 5));
  if (b.tour !== undefined) data.tour = String(b.tour);
  if (b.text !== undefined) data.text = String(b.text);

  await prisma.review.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
