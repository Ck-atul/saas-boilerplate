import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { createSecureToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      mobile,
      password,
      role, // optional role, client can request ADMIN
      adminCode, // secret code for admin registration
    } = await request.json();

    // Basic validation
    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
    }

    // ---------- Role handling ----------
    // Default role is USER. If CLIENT asks for ADMIN, verify the secret code.
    let finalRole: "USER" | "ADMIN" = "USER";
    const ADMIN_SIGNUP_CODE = process.env.ADMIN_SIGNUP_CODE; // define in .env
    if (role === "ADMIN") {
      if (!adminCode || adminCode !== ADMIN_SIGNUP_CODE) {
        return NextResponse.json({ error: "Invalid admin registration code." }, { status: 403 });
      }
      finalRole = "ADMIN" as const;
    }
    // -----------------------------------

    const hashed = await hashPassword(password);
    const verificationToken = createSecureToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashed,
        role: finalRole,
        emailVerified: false,
        verificationToken,
        verificationExpires,
      },
    });

    // Send verification email
    await sendVerificationEmail(name, email, verificationToken);

    return NextResponse.json(
      {
        message: "Account created. We've sent an activation link to your email. Please verify to enable login.",
        email,
        role: finalRole,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
