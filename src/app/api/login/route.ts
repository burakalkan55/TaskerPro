import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return Response.json(
      { message: "Login successful", user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
