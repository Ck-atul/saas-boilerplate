import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { getAuthPayload } from "@/lib/session";
import { AuditAction, logAudit } from "@/lib/audit";

export async function GET() {
  const payload = await getAuthPayload();
  if (!payload) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      name: true,
      email: true,
      mobile: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const payload = await getAuthPayload();
  if (!payload) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { name, mobile, password } = await request.json();
  const data: { name?: string; mobile?: string; password?: string } = {};

  if (name) data.name = name;
  if (mobile) data.mobile = mobile;
  if (password) {
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    data.password = await hashPassword(password);
    await logAudit(payload.userId, AuditAction.PASSWORD_CHANGED);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: payload.userId },
    data,
    select: {
      name: true,
      email: true,
      mobile: true,
      image: true,
      role: true,
      emailVerified: true,
    },
  });

  await logAudit(payload.userId, AuditAction.PROFILE_UPDATED, {
    fields: Object.keys(data).filter((k) => k !== "password"),
  });

  return NextResponse.json(user);
}
