import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUser";

export async function POST(req: NextRequest) {
  const { inviteId, roomId } = await req.json();
  
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1) invite güncelle
  const updated = await prisma.invite.update({
    where: { id: inviteId },
    data: { status: "ACCEPTED" },
  });

  // 2) room member olarak ekle
  await prisma.roomMember.create({
    data: {
      roomId,
      userId: user.id,
    },
  });

  // 3) TODO: WebSocket broadcast (buna birazdan geleceğiz!)

  return NextResponse.json({ ok: true });
}
