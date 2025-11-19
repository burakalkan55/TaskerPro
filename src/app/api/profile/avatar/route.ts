import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getLoggedUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getLoggedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  // ---- Convert file to buffer ----
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // ---- Upload Cloudinary ----
  const uploadRes = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "taskerpro_avatars" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  const uploaded = uploadRes as any;

  // ---- Update user in DB ----
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { avatar: uploaded.secure_url },
  });

  return NextResponse.json({ avatar: uploaded.secure_url, user: updatedUser });
}
