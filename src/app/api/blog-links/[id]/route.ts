import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorizedResponse } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const { id } = await params;
  const body = await request.json();
  const { title, url, order } = body;

  const link = await prisma.blogLink.update({
    where: { id },
    data: { title, url, order },
  });
  return NextResponse.json(link);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const { id } = await params;
  await prisma.blogLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
