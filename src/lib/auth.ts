import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function requireAdmin(): Promise<
  { adminId: string; username: string } | NextResponse
> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { adminId: session.adminId, username: session.username };
}

export function isUnauthorizedResponse(
  result: { adminId: string; username: string } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
