import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { AuditAction, logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const reset = await prisma.passwordResetToken.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    include: { user: true },
  });

  if (!reset) {
    return NextResponse.json(
      { error: "Invalid or expired reset link." },
      { status: 400 }
    );
  }

  const hashed = await hashPassword(password);

  await prisma.user.update({
    where: { id: reset.userId },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.deleteMany({ where: { userId: reset.userId } });
  await logAudit(reset.userId, AuditAction.PASSWORD_CHANGED, {
    via: "reset",
  });

  return NextResponse.json({ message: "Password updated. You can log in now." });
}
