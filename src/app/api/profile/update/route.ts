import { NextResponse } from "next/server";
import { getLoggedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getLoggedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, bio } = body;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, bio },
  });

  return NextResponse.json({ user: updated });
}
