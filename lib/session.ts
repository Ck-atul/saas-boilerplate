import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function parseUserId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return parseInt(value, 10);
  return null;
}

export async function getAuthPayload() {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  const userId = parseUserId(payload?.userId);
  if (userId === null) return null;

  return {
    userId,
    role: payload!.role as string,
  };
}

export async function getCurrentUser() {
  const payload = await getAuthPayload();
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
  });
}
