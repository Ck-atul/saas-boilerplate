import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthPayload } from "@/lib/session";

export async function GET(request: Request) {
  const payload = await getAuthPayload();
  if (!payload) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const limit = Number(new URL(request.url).searchParams.get("limit") ?? "20");
  const isAdmin = payload.role === "ADMIN";

  const logs = await prisma.auditLog.findMany({
    where: isAdmin ? {} : { userId: payload.userId },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 50),
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(logs);
}
