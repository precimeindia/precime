import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorizedResponse } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const { id } = await params;
  const body = await request.json();
  const { question, answer, order } = body;

  const faq = await prisma.fAQ.update({
    where: { id },
    data: { question, answer, order },
  });
  return NextResponse.json(faq);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const { id } = await params;
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
