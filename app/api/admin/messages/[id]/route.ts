import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ContactStatus } from "@prisma/client";

const VALID: ContactStatus[] = ["NEW", "REPLIED", "ARCHIVED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const status = body.status as ContactStatus | undefined;
  if (!status || !VALID.includes(status)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 422 });
  }

  await prisma.contactMessage.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true, status });
}
