import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: any) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split(";").find((x: any) => x.trim().startsWith("token="))?.split("=")[1];

  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rooms = await prisma.room.findMany({
    where: { ownerId: decoded.userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ rooms });
}
