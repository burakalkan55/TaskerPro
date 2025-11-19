import { NextResponse } from "next/server";
import { getLoggedUser } from "@/lib/auth";

export async function GET() {
  const user = await getLoggedUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ user });
}
