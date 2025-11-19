import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, title, status } = await req.json();

    if (!id) {
      return Response.json({ error: "Task ID required" }, { status: 400 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(status && { status }),
      },
    });

    return Response.json({ task: updated }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
