// lib/db.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["query"],
//   });
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

console.log("✅ DATABASE_URL in lib/db.js:", process.env.DATABASE_URL);

export { prisma };
