import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthPayload } from "@/lib/session";
import { AuditAction, logAudit } from "@/lib/audit";

function parseId(raw: string) {
  const id = parseInt(raw, 10);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getAuthPayload();
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetId = parseId((await params).id);
  if (targetId === null) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  const { role } = await request.json();

  if (role !== "USER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  if (targetId === payload.userId) {
    return NextResponse.json(
      { error: "You cannot change your own role." },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: targetId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  await logAudit(payload.userId, AuditAction.ROLE_CHANGED, {
    targetUserId: targetId,
    role,
  });

  return NextResponse.json(user);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getAuthPayload();
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetId = parseId((await params).id);
  if (targetId === null) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  if (targetId === payload.userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id: targetId } });
  await logAudit(payload.userId, AuditAction.USER_DELETED, {
    targetUserId: targetId,
  });

  return NextResponse.json({ message: "User deleted." });
}
