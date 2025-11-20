import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUser";

export async function POST(req: NextRequest) {
  const { inviteId } = await req.json();
  
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!inviteId) {
    return NextResponse.json({ error: "Missing inviteId" }, { status: 400 });
  }

  // Invite'ı REJECTED olarak işaretle
  await prisma.invite.update({
    where: { id: inviteId },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ ok: true });
}
