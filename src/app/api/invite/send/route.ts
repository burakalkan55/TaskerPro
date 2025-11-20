import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUser";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromToken(req);

    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roomId, receiverId } = await req.json();

    if (!roomId || !receiverId)
      return NextResponse.json(
        { error: "Missing roomId or receiverId" },
        { status: 400 }
      );

    // Invite oluştur
    const invite = await prisma.invite.create({
      data: {
        roomId,
        senderId: authUser.id,
        receiverId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ invite });
  } catch (err) {
    console.error("invite send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
