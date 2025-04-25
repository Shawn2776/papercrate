// lib/db/audited.js
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/logging/logAudit";
import diff from "just-diff"; // must be installed

export async function auditedUpdate({ user, model, where, data, entityId }) {
  const existing = await prisma[model].findUnique({ where });
  const updated = await prisma[model].update({ where, data });

  const rawDiff = diff(existing, updated);

  const meaningfulDiff = {};
  rawDiff.forEach((change) => {
    if (change.op === "replace") {
      const key = change.path[0];
      meaningfulDiff[key] = {
        before: change.value[0],
        after: change.value[1],
      };
    }
  });

  if (Object.keys(meaningfulDiff).length > 0) {
    await logAudit({
      userId: user.id,
      email: user.primaryEmailAddress?.emailAddress || "unknown",
      action: `Updated ${model}`,
      entity: model,
      entityId: entityId || updated.id,
      metadata: meaningfulDiff,
    });
  }

  return updated;
}
