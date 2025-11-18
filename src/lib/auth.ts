import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super-secret-key";

export function generateToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch (err) {
    return null;
  }
}
