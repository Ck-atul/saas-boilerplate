import { randomBytes } from "crypto";

export function createSecureToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}
