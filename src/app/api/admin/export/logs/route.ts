import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorizedResponse } from "@/lib/auth";
import Papa from "papaparse";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const days = searchParams.get("days");

  let fromDate: string;
  let toDate: string;

  if (from && to) {
    fromDate = from;
    toDate = to;
  } else {
    const d = parseInt(days || "7");
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - d + 1);
    fromDate = start.toISOString().slice(0, 10);
    toDate = end.toISOString().slice(0, 10);
  }

  const logs = await prisma.metalRatioLog.findMany({
    where: { date: { gte: fromDate, lte: toDate } },
    orderBy: { createdAt: "asc" },
  });

  const csvData = logs.map((l) => ({
    id: l.id,
    createdAt: l.createdAt.toISOString(),
    date: l.date,
    note: l.note || "",
    oldValues: l.oldValues,
    newValues: l.newValues,
  }));

  const csv = Papa.unparse(csvData);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="precime-logs-${fromDate}-to-${toDate}.csv"`,
    },
  });
}
