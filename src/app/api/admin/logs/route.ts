import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    const where = from && to ? { createdAt: { gte: new Date(from), lte: new Date(to + "T23:59:59") } } : {};

    const logs = await prisma.metalRatioLog.findMany({
      where: from && to ? { date: { gte: from, lte: to } } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/admin/logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
