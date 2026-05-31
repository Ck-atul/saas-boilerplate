import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { getAuthPayload } from "@/lib/session";
import { AuditAction, logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const payload = await getAuthPayload();
  if (!payload) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Avatar file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Max file size is 2MB." }, { status: 400 });
  }

  const ext = file.type.split("/")[1] ?? "png";
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${payload.userId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  const imageUrl = `/uploads/avatars/${filename}`;

  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { image: imageUrl },
    select: { image: true },
  });

  await logAudit(payload.userId, AuditAction.AVATAR_UPDATED);

  return NextResponse.json({ image: user.image });
}
