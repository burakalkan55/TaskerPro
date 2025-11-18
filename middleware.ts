import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: any) {
  const cookieHeader = req.headers.get("cookie");

  // Cookie yoksa → login
  if (!cookieHeader) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // token=xxx formatını yakala
  const token = cookieHeader
    .split(";")
    .find((c: string) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
