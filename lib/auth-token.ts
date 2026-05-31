import { jwtVerify } from "jose";

export type AuthPayload = {
  userId: number;
  role: string;
};

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

function parseUserId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return parseInt(value, 10);
  return null;
}

/** Edge-safe JWT verification (use in middleware). */
export async function verifyAuthToken(
  token: string
): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const userId = parseUserId(payload.userId);
    const role = payload.role;
    if (userId === null || typeof role !== "string") {
      return null;
    }
    return { userId, role };
  } catch {
    return null;
  }
}
