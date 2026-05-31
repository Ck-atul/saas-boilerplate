import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuditAction, logAudit } from "@/lib/audit";
import { sendActivationSuccessEmail } from "@/lib/email";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token is required." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired verification link." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  await logAudit(user.id, AuditAction.EMAIL_VERIFIED);

  try {
    await sendActivationSuccessEmail(user.name, user.email);
  } catch (err) {
    console.error("Activation success email failed:", err);
  }

  return NextResponse.json({
    message: "Account activated successfully. You can sign in now.",
    email: user.email,
    name: user.name,
  });
}
