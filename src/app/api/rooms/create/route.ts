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

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  const room = await prisma.room.create({
    data: {
      name,
      ownerId: decoded.userId,
    },
  });

  return NextResponse.json({ room }, { status: 201 });
}
