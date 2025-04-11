/*
  Warnings:

  - You are about to drop the column `deleted` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankDetail" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InvoiceSettings" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PaymentStatus" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TenantMembership" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
