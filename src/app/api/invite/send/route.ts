// src/app/api/invite/send/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const { roomId, email } = await req.json();

    if (!roomId || !email) {
      return NextResponse.json(
        { error: "roomId and email are required" },
        { status: 400 }
      );
    }

    const sender = await getUserFromToken(req);
    if (!sender) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const receiver = await prisma.user.findUnique({
      where: { email },
    });

    if (!receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Aynı odada zaten üye mi?
    const alreadyMember = await prisma.roomMember.findFirst({
      where: {
        roomId,
        userId: receiver.id,
      },
    });

    if (alreadyMember) {
      return NextResponse.json(
        { error: "User is already a member of this room" },
        { status: 400 }
      );
    }

    // Pending invite var mı?
    const existingInvite = await prisma.invite.findFirst({
      where: {
        roomId,
        receiverEmail: email,
        status: "pending",
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "There is already a pending invite for this user" },
        { status: 400 }
      );
    }

    const invite = await prisma.invite.create({
      data: {
        roomId,
        senderId: sender.id,
        receiverEmail: email,
        status: "pending",
      },
    });

    return NextResponse.json({ invite });
  } catch (err) {
    console.error("invite send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
