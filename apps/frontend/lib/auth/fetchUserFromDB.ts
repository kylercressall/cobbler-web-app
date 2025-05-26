import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function fetchUserFromDB(email: string, password: string) {
  if (!email || !password) return null;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // User must exist and have a password
    if (!user || !user.password) return null;

    // make sure the password hashes match
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
}
