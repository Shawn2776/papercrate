import { prisma } from "@/lib/prisma";
import { auditLogMiddleware } from "@/prisma/middleware/auditLogMiddleware";

export function prismaWithUser(userId: string) {
  prisma.$use(auditLogMiddleware(userId));
  return prisma;
}
