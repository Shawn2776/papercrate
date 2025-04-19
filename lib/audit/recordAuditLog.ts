import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

type AuditAction = "CREATE" | "UPDATE" | "DELETE";

interface AuditLogParams {
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

function computeDiff(
  before: Record<string, unknown> = {},
  after: Record<string, unknown> = {}
): Record<string, { from: unknown; to: unknown }> {
  const diff: Record<string, { from: unknown; to: unknown }> = {};

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    const from = before[key];
    const to = after[key];

    if (JSON.stringify(from) !== JSON.stringify(to)) {
      diff[key] = { from, to };
    }
  }

  return diff;
}

export async function recordAuditLog({
  action,
  entityType,
  entityId,
  userId,
  before,
  after,
  payload,
}: AuditLogParams): Promise<void> {
  const diff =
    action === "UPDATE" && before && after
      ? computeDiff(before, after)
      : undefined;

  await prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      userId,
      before: before as Prisma.InputJsonValue,
      after: after as Prisma.InputJsonValue,
      payload: payload as Prisma.InputJsonValue,
      diff: diff as Prisma.InputJsonValue,
    },
  });
}
