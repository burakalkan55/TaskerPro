import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUser";

export async function GET(req: Request) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ rooms: [] });

  // ✔ Kullanıcının sahip olduğu odalar
  const owned = await prisma.room.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // ✔ Kullanıcının üye olduğu odalar
  const member = await prisma.roomMember.findMany({
    where: { userId: user.id },
    include: { room: true },
    orderBy: { joinedAt: "desc" },
  });

  // member[*].room formatına dönüştür
  const memberRooms = member.map((m) => m.room);

  // ✔ Duplicate olmasın diye Set ile birleştir
  const map = new Map();

  [...owned, ...memberRooms].forEach((r) => {
    map.set(r.id, r);
  });

  const rooms = Array.from(map.values());

  return NextResponse.json({ rooms });
}
