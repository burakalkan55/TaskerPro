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

/**
 * Server Components veya API route'larda,
 * next/headers.cookies() ile token okuyup user döner.
 */
export async function getUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

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

/**
 * API route'larda Request objesinden cookie header'ı okuyup user döner.
 * Şu an senin `import { getUserFromToken } from "@/lib/getUser";` 
 * diye kullandığın fonksiyon BU olacak.
 */
export async function getUserFromToken(req: Request): Promise<AuthUser | null> {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;

    const token = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("token="))
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

    return user as AuthUser | null;
  } catch (err) {
    console.error("getUserFromToken error:", err);
    return null;
  }
}
