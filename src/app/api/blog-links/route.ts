import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorizedResponse } from "@/lib/auth";

export async function GET() {
  const links = await prisma.blogLink.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(links);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (isUnauthorizedResponse(authResult)) return authResult;

  const body = await request.json();
  const { title, url, order } = body;
  if (!title || !url) return NextResponse.json({ error: "title and url required" }, { status: 400 });

  const link = await prisma.blogLink.create({ data: { title, url, order: order ?? 0 } });
  return NextResponse.json(link, { status: 201 });
}
