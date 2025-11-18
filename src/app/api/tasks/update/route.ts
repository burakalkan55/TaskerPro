export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie");

  const token = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  const decoded = token ? verifyToken(token) : null;

  if (!decoded)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, status } = await req.json();

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  return NextResponse.json({ task });
}
