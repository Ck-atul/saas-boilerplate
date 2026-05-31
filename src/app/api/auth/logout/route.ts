import { NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/session";
import { AuditAction, logAudit } from "@/lib/audit";

export async function POST() {
  const payload = await getAuthPayload();
  if (payload) {
    await logAudit(payload.userId, AuditAction.USER_LOGOUT);
  }

  const response = NextResponse.json({ message: "Logged out." });
  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
