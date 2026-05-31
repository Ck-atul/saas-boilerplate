// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 12;
const JWT_SECRET: string = process.env.JWT_SECRET ?? "replace‑with‑strong‑secret";

/* -------------------------------------------------
   Password hashing / verification
   ------------------------------------------------- */
export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

/* -------------------------------------------------
   JWT creation / verification
   ------------------------------------------------- */
export function signToken(
  payload: Record<string, unknown>,
  expiresIn: jwt.SignOptions["expiresIn"] = "7d"
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): Record<string, any> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, any>;
  } catch {
    return null;
  }
}
