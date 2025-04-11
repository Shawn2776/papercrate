-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'BASIC', 'PRO', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "plan" "PlanTier" NOT NULL DEFAULT 'FREE';
