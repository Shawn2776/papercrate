import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export function auditLogMiddleware(userId: string): Prisma.Middleware {
  return async (params, next) => {
    const { action, model, args } = params;

    const trackedActions: Prisma.MiddlewareParams["action"][] = [
      "create",
      "update",
      "delete",
    ];

    if (
      !trackedActions.includes(action) ||
      !model ||
      model === "AuditLog" ||
      !userId
    ) {
      return next(params);
    }

    let before: unknown = undefined;
    let result: unknown = undefined;

    const typedPrisma = prisma as PrismaClient & {
      [key: string]: {
        findUnique?: (args: {
          where: { id: string | number };
        }) => Promise<unknown>;
      };
    };

    try {
      const modelDelegate = typedPrisma[model];

      if (
        (action === "update" || action === "delete") &&
        typeof modelDelegate?.findUnique === "function" &&
        typeof args?.where?.id !== "undefined"
      ) {
        before = await modelDelegate.findUnique({
          where: { id: args.where.id },
        });
      }

      result = await next(params);

      const entityId = (result as { id?: string | number })?.id?.toString?.();
      if (!entityId) {
        console.warn(`[AuditLog] No entity ID found for model "${model}"`);
        return result;
      }

      await prisma.auditLog.create({
        data: {
          action: action.toUpperCase(),
          entityType: model,
          entityId,
          userId,
          before: before ? JSON.parse(JSON.stringify(before)) : undefined,
          after:
            action === "delete"
              ? undefined
              : result
              ? JSON.parse(JSON.stringify(result))
              : undefined,
        },
      });

      return result;
    } catch (err) {
      console.error("Audit middleware error:", err);
      throw err;
    }
  };
}
