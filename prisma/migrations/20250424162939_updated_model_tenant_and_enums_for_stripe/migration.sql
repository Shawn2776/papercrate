/*
  Warnings:

  - The values [BASIC] on the enum `PlanTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "SelectedPlan" AS ENUM ('ENHANCED', 'PRO', 'ENTERPRISE');

-- AlterEnum
BEGIN;
CREATE TYPE "PlanTier_new" AS ENUM ('FREE', 'ENHANCED', 'PRO', 'ENTERPRISE');
ALTER TABLE "Tenant" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "Tenant" ALTER COLUMN "plan" TYPE "PlanTier_new" USING ("plan"::text::"PlanTier_new");
ALTER TYPE "PlanTier" RENAME TO "PlanTier_old";
ALTER TYPE "PlanTier_new" RENAME TO "PlanTier";
DROP TYPE "PlanTier_old";
ALTER TABLE "Tenant" ALTER COLUMN "plan" SET DEFAULT 'FREE';
COMMIT;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "billingCycle" "BillingCycle",
ADD COLUMN     "selectedPlan" "SelectedPlan";
