import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;

  if (!token) return NextResponse.json({ tasks: [] }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ tasks: [] }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId)
    return NextResponse.json({ tasks: [] }, { status: 400 });

  const tasks = await prisma.task.findMany({
    where: { roomId },
  });

  return NextResponse.json({ tasks });
}
