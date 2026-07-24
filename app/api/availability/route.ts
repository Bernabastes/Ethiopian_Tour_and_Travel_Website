import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AvailabilityStatus } from "@prisma/client";

// GET /api/availability?tourSlug=... → public list of availability overrides for a tour.
export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: true, items: [] });
  const { searchParams } = new URL(request.url);
  const tourSlug = searchParams.get("tourSlug");
  if (!tourSlug) return NextResponse.json({ ok: false, error: "tourSlug required" }, { status: 422 });

  try {
    const items = await prisma.availability.findMany({
      where: { tourSlug },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({
      ok: true,
      items: items.map((i) => ({
        date: i.date.toISOString().slice(0, 10),
        status: i.status,
        spots: i.spots,
      })),
    });
  } catch (err) {
    console.error("[AVAILABILITY] query failed:", err);
    return NextResponse.json({ ok: true, items: [] });
  }
}

// POST (admin) → upsert a single date's availability.
const VALID: AvailabilityStatus[] = ["AVAILABLE", "LIMITED", "FULL", "OFF"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    tourSlug?: string;
    date?: string;
    status?: string;
    spots?: number;
  };
  const { tourSlug, date } = body;
  const status = body.status as AvailabilityStatus | undefined;
  if (!tourSlug || !date || !status || !VALID.includes(status)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 422 });
  }

  const spots = typeof body.spots === "number" ? body.spots : status === "FULL" ? 0 : 8;
  const d = new Date(date);

  const saved = await prisma.availability.upsert({
    where: { tourSlug_date: { tourSlug, date: d } },
    update: { status, spots },
    create: { tourSlug, date: d, status, spots },
  });

  return NextResponse.json({
    ok: true,
    item: { date: saved.date.toISOString().slice(0, 10), status: saved.status, spots: saved.spots },
  });
}
