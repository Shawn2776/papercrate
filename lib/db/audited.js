// lib/db/audited.js
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/logging/logAudit";
import { diff } from "just-diff"; // must be installed

export async function auditedUpdate({ user, model, where, data, entityId }) {
  const existing = await prisma[model].findUnique({ where });
  const updated = await prisma[model].update({ where, data });

  const rawExisting = JSON.parse(JSON.stringify(existing));
  const rawUpdated = JSON.parse(JSON.stringify(updated));

  const rawDiff = diff(rawExisting, rawUpdated);

  const filteredDiff = rawDiff.filter(
    (change) => change.op === "replace" && change.path[0] !== "updatedAt"
  );

  const meaningfulDiff = {};
  filteredDiff.forEach((change) => {
    const key = change.path[0];
    const before = rawExisting[key];
    const after = rawUpdated[key];

    if (
      before === after ||
      before === undefined ||
      after === undefined ||
      (typeof before === "number" && isNaN(before)) ||
      (typeof after === "number" && isNaN(after))
    ) {
      return;
    }

    meaningfulDiff[key] = { before, after };
  });

  const summary = Object.entries(meaningfulDiff)
    .map(
      ([key, { before, after }]) =>
        `Changed ${key} from "${before}" to "${after}"`
    )
    .join("; ");

  if (Object.keys(meaningfulDiff).length > 0) {
    await logAudit({
      userId: user.id,
      email: user.primaryEmailAddress?.emailAddress || "unknown",
      action: `Updated ${model}`,
      entity: model,
      entityId: entityId || updated.id,
      metadata: meaningfulDiff,
      summary,
    });
  }

  return updated;
}

export async function auditedCreate({ user, model, data }) {
  const created = await prisma[model].create({ data });

  const cleanedCreated = JSON.parse(JSON.stringify(created));

  // Optional: remove fields like createdAt, updatedAt, deleted if you want
  const { createdAt, updatedAt, deleted, ...auditableData } = cleanedCreated;

  await logAudit({
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress || "unknown",
    action: `Created ${model}`,
    entity: model,
    entityId: created.id,
    metadata: auditableData, // 🔥 much cleaner metadata
  });

  return created;
}

export async function auditedDelete({ user, model, where }) {
  const existing = await prisma[model].findUnique({ where });

  const deleted = await prisma[model].delete({ where });

  // Remove system fields if you want
  const {
    createdAt,
    updatedAt,
    deleted: deletedFlag,
    ...auditableData
  } = JSON.parse(JSON.stringify(existing));

  const summary = `Deleted ${model} "${
    auditableData.name || auditableData.id
  }"`;

  await logAudit({
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress || "unknown",
    action: `Deleted ${model}`,
    entity: model,
    entityId: deleted.id,
    metadata: auditableData,
    summary, // 📝
  });

  return deleted;
}

export async function auditedUpsert({ user, model, where, update, create }) {
  const existing = await prisma[model].findUnique({ where });

  const result = await prisma[model].upsert({
    where,
    update,
    create,
  });

  const cleanedExisting = existing
    ? JSON.parse(JSON.stringify(existing))
    : null;
  const cleanedResult = JSON.parse(JSON.stringify(result));

  let metadata = {};

  if (cleanedExisting) {
    const rawDiff = diff(cleanedExisting, cleanedResult);

    const filteredDiff = rawDiff.filter(
      (change) => change.op === "replace" && change.path[0] !== "updatedAt"
    );

    filteredDiff.forEach((change) => {
      const key = change.path[0];
      const before = cleanedExisting[key];
      const after = cleanedResult[key];

      if (
        before === after ||
        before === undefined ||
        after === undefined ||
        (typeof before === "number" && isNaN(before)) ||
        (typeof after === "number" && isNaN(after))
      ) {
        return;
      }

      metadata[key] = { before, after };
    });
  } else {
    // No previous record = treat like create
    const { createdAt, updatedAt, deleted, ...newData } = cleanedResult;
    metadata = newData;
  }

  const summary = Object.entries(metadata)
    .map(([key, { before, after }]) =>
      typeof before === "object" && typeof after === "object"
        ? `Updated ${key}`
        : `Changed ${key} from "${before}" to "${after}"`
    )
    .join("; ");

  await logAudit({
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress || "unknown",
    action: existing ? `Updated ${model}` : `Created ${model}`,
    entity: model,
    entityId: result.id,
    metadata,
    summary,
  });

  return result;
}
