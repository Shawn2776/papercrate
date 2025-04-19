import { Prisma } from "@prisma/client";

export function isDuplicateInvoiceError(
  err: unknown
): err is Prisma.PrismaClientKnownRequestError {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
}
