import { PrismaClient } from "@prisma/client";
import { auditLogMiddleware } from "./middleware/auditLogMiddleware";

export function prismaWithUser(userId: string) {
  const scopedPrisma = new PrismaClient();
  scopedPrisma.$use(auditLogMiddleware(userId));
  return scopedPrisma;
}
