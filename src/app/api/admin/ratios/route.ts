import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorizedResponse } from "@/lib/auth";
import { z } from "zod";

const ratioSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  Au: z.number().min(0),
  Ag: z.number().min(0),
  Pt: z.number().min(0),
  Pd: z.number().min(0),
  Rh: z.number().min(0),
  Ir: z.number().min(0),
  Os: z.number().min(0),
  Hg: z.number().min(0),
  Cu: z.number().min(0).optional(),
  note: z.string().max(500).optional(),
  publishAt: z.string().datetime().optional().nullable(), // ISO string or null = publish now
});

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  try {
    const body = await request.json();
    const parsed = ratioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
    }

    const { note, publishAt, ...ratioData } = parsed.data;
    // Allow Cu to be set by the client, defaulting to 1.0
    const newValues = { Cu: 1.0, ...ratioData };

    // Convert publishAt to Date or null
    const publishAtDate = publishAt ? new Date(publishAt) : null;

    // Read existing values for the log
    const existing = await prisma.metalRatio.findUnique({ where: { date: newValues.date } });
    const oldValues = existing
      ? { Au: existing.Au, Ag: existing.Ag, Pt: existing.Pt, Pd: existing.Pd, Rh: existing.Rh, Ir: existing.Ir, Os: existing.Os, Ru: existing.Ru, Hg: existing.Hg, Cu: existing.Cu }
      : {};

    // Upsert MetalRatio
    const upserted = await prisma.metalRatio.upsert({
      where: { date: newValues.date },
      update: { ...newValues, publishAt: publishAtDate },
      create: { ...newValues, publishAt: publishAtDate },
    });

    // Always insert a log entry
    await prisma.metalRatioLog.create({
      data: {
        metalRatioId: upserted.id,
        date: newValues.date,
        note: note || null,
        oldValues: JSON.stringify(oldValues),
        newValues: JSON.stringify({ ...newValues, publishAt: publishAtDate?.toISOString() ?? null }),
      },
    });

    const isScheduled = publishAtDate && publishAtDate > new Date();
    return NextResponse.json({ success: true, ratio: upserted, scheduled: isScheduled });
  } catch (error) {
    console.error("POST /api/admin/ratios error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  try {
    if (date) {
      const ratio = await prisma.metalRatio.findUnique({ where: { date } });
      return NextResponse.json(ratio || null);
    }
    
    if (searchParams.get("status") === "scheduled") {
      const scheduled = await prisma.metalRatio.findMany({
        where: { publishAt: { gt: new Date() } },
        orderBy: { publishAt: "asc" },
      });
      return NextResponse.json(scheduled);
    }

    // Return all including scheduled (admin sees everything if no filter)
    const ratios = await prisma.metalRatio.findMany({ orderBy: { date: "desc" }, take: 90 });
    return NextResponse.json(ratios);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
