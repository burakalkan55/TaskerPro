import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUser";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("id");

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID missing" },
        { status: 400 }
      );
    }

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Odayı bul
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Sadece owner silebilir
    if (room.ownerId !== user.id) {
      return NextResponse.json(
        { error: "You are not the owner of this room" },
        { status: 403 }
      );
    }

    // İlişkili kayıtları temizle
    await prisma.invite.deleteMany({ where: { roomId } });
    await prisma.task.deleteMany({ where: { roomId } });
    await prisma.roomMember.deleteMany({ where: { roomId } });

    // Son olarak room’u sil
    await prisma.room.delete({
      where: { id: roomId },
    });

    return NextResponse.json(
      { success: true, message: "Room deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE ROOM ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
