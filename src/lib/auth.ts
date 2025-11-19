import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET || "super-secret-key";

export function generateToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// ⭐ EN ÖNEMLİ KISIM: Cookie'den USER çek
export async function getLoggedUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Prisma’dan user çekiyoruz
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      createdAt: true,
    },
  });

  return user;
}
