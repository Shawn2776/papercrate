import { PrismaClient } from "@prisma/client";
import { auditLogMiddleware } from "./middleware/auditLogMiddleware";

export function prismaWithUser(userId: string) {
  const scopedPrisma = new PrismaClient(); // ⛔️ Don't use this without disconnecting after
  scopedPrisma.$use(auditLogMiddleware(userId));
  return scopedPrisma;
}
