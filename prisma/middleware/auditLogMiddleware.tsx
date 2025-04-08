import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Define the middleware function factory
export function auditLogMiddleware(userId: string): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next) => {
    const result = await next(params);

    const actionType = params.action.toUpperCase();
    const model = params.model;
    const recordId = result?.id?.toString?.();

    const trackedActions = ["CREATE", "UPDATE", "DELETE"];

    // Skip logging audit logs themselves
    if (model === "AuditLog") return result;

    if (trackedActions.includes(actionType) && model && recordId && userId) {
      try {
        await prisma.auditLog.create({
          data: {
            action: actionType,
            table: model,
            recordId,
            data: params.args?.data ?? null,
            userId,
          },
        });
      } catch (err) {
        console.error("Audit log error:", err);
      }
    }

    return result;
  };
}
