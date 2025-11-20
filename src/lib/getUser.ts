// src/lib/getUser.ts
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyToken } from "./auth";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
};

/* --------------------- SERVER COMPONENT İÇİN --------------------- */
export async function getUser(): Promise<AuthUser | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return user as AuthUser | null;
  } catch (err) {
    console.error("getUser error:", err);
    return null;
  }
}

/* --------------------- API ROUTE İÇİN --------------------- */
export async function getUserFromToken(req: Request): Promise<AuthUser | null> {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;

    const token = cookieHeader
      .split(";")
      .map((p) => p.trim())
      .find((p) => p.startsWith("token="))
      ?.split("=")[1];

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return user as AuthUser;
  } catch (err) {
    console.error("getUserFromToken error:", err);
    return null;
  }
}
