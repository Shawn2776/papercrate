import { PrismaClient } from "@prisma/client";
import { auditLogMiddleware } from "@/prisma/middleware/auditLogMiddleware";

export function prismaWithUser(userId: string): PrismaClient {
  // Clone the client instance
  const client = new PrismaClient();

  // Attach the audit middleware with the given userId
  client.$use(auditLogMiddleware(userId));

  return client;
}
