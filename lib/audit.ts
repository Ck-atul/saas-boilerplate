import prisma from "@/lib/prisma";

export const AuditAction = {
  USER_LOGIN: "USER_LOGGED_IN",
  USER_LOGOUT: "USER_LOGGED_OUT",
  PASSWORD_CHANGED: "USER_CHANGED_PASSWORD",
  PROFILE_UPDATED: "USER_UPDATED_PROFILE",
  AVATAR_UPDATED: "USER_UPDATED_AVATAR",
  EMAIL_VERIFIED: "USER_VERIFIED_EMAIL",
  ROLE_CHANGED: "ADMIN_CHANGED_ROLE",
  USER_DELETED: "ADMIN_DELETED_USER",
} as const;

export async function logAudit(
  userId: number,
  action: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}
