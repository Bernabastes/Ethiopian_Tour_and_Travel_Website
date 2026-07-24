import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

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

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const willPublish = b.published !== undefined ? Boolean(b.published) : existing.published;
  const data: Record<string, unknown> = {};
  if (b.title !== undefined) data.title = String(b.title);
  if (b.slug !== undefined) data.slug = slugify(String(b.slug));
  if (b.excerpt !== undefined) data.excerpt = String(b.excerpt);
  if (b.content !== undefined) data.content = String(b.content);
  if (b.coverImage !== undefined) data.coverImage = String(b.coverImage);
  if (b.category !== undefined) data.category = String(b.category);
  if (b.author !== undefined) data.author = String(b.author);
  if (b.readMinutes !== undefined) data.readMinutes = Number(b.readMinutes) || 5;
  if (b.metaTitle !== undefined) data.metaTitle = b.metaTitle ? String(b.metaTitle) : null;
  if (b.metaDescription !== undefined) data.metaDescription = b.metaDescription ? String(b.metaDescription) : null;
  if (b.published !== undefined) {
    data.published = willPublish;
    // Set publishedAt the first time it goes live.
    if (willPublish && !existing.publishedAt) data.publishedAt = new Date();
  }

  const updated = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json({ ok: true, slug: updated.slug });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
