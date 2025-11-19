import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json({ error: "Task ID required" }, { status: 400 });
    }

    await prisma.task.delete({ where: { id } });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
