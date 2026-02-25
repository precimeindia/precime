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

  const ratios = await prisma.metalRatio.findMany({
    where: { date: { gte: fromDate, lte: toDate } },
    orderBy: { date: "asc" },
  });

  const csvData = ratios.map((r) => ({
    date: r.date,
    Au: r.Au,
    Ag: r.Ag,
    Pt: r.Pt,
    Pd: r.Pd,
    Rh: r.Rh,
    Ir: r.Ir,
    Os: r.Os,
    Ru: r.Ru,
    Hg: r.Hg,
    Cu: r.Cu,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  const csv = Papa.unparse(csvData);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="precime-ratios-${fromDate}-to-${toDate}.csv"`,
    },
  });
}
