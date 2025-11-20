import { NextResponse } from "next/server";
import { getLoggedUser } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const user = await getLoggedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { oldPassword, newPassword } = await req.json();

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // verify old password
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const valid = await bcrypt.compare(oldPassword, dbUser.password);

  if (!valid) {
    return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
  }

  // hash new password
  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ message: "Password updated" }, { status: 200 });
}
