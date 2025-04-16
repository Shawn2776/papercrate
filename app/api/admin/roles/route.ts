import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const roles = Object.values(Role); // ✅ enum values as array of strings

  return Response.json({ roles });
}
