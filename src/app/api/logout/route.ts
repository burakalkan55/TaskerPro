export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // token cookie'sini sil
  res.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return res;
}
