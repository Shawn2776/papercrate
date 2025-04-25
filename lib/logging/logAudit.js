// lib/logging/logAudit.js
import { prisma } from "@/lib/db";

export async function logAudit({
  userId,
  email,
  action,
  entity,
  entityId = null,
  metadata = {},
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        email,
        action,
        entity,
        entityId,
        metadata,
      },
    });
  } catch (err) {
    console.error("❌ Failed to write audit log:", err);
  }
}
