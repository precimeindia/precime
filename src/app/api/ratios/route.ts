import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const now = () => new Date();

// Only return ratios that are published (publishAt is null OR publishAt <= now)
const publishedFilter = {
  OR: [
    { publishAt: null },
    { publishAt: { lte: now() } },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  try {
    if (date) {
      const ratio = await prisma.metalRatio.findFirst({
        where: { date, ...publishedFilter },
      });
      if (!ratio) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(ratio);
    }

    if (from && to) {
      const ratios = await prisma.metalRatio.findMany({
        where: { date: { gte: from, lte: to }, ...publishedFilter },
        orderBy: { date: "desc" },
        take: 90,
      });
      return NextResponse.json(ratios);
    }

    // Latest published
    const ratio = await prisma.metalRatio.findFirst({
      where: publishedFilter,
      orderBy: { date: "desc" },
    });
    if (!ratio) return NextResponse.json({ error: "No data yet" }, { status: 404 });
    return NextResponse.json(ratio);
  } catch (error) {
    console.error("GET /api/ratios error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
