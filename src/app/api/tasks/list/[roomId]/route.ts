export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = params;
  const cookieHeader = req.headers.get("cookie");

  const token = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  const decoded = token ? verifyToken(token) : null;

  if (!decoded) return NextResponse.json({ tasks: [] });

  const tasks = await prisma.task.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ tasks });
}
