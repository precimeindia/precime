import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorizedResponse } from "@/lib/auth";

export async function GET() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const body = await request.json();
  const { question, answer, order } = body;
  if (!question || !answer) return NextResponse.json({ error: "question and answer required" }, { status: 400 });

  const faq = await prisma.fAQ.create({ data: { question, answer, order: order ?? 0 } });
  return NextResponse.json(faq, { status: 201 });
}
