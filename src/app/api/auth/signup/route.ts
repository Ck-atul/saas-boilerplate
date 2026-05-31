import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { createSecureToken } from "@/lib/tokens";
export async function POST(request: Request) {
  try {
    const { name, email, mobile, password } = await request.json();

    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const verificationToken = createSecureToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashed,
        role: "USER",
        emailVerified: false,
        verificationToken,
        verificationExpires,
      },
    });

    await sendVerificationEmail(name, email, verificationToken);

    return NextResponse.json(
      {
        message:
          "Account created. We've sent an activation link to your email. Please verify to enable login.",
        email,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
