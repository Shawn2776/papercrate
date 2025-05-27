-- CreateEnum
CREATE TYPE "LineItemType" AS ENUM ('PRODUCT', 'SERVICE');

-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "type" "LineItemType";

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_taxRateId_fkey" FOREIGN KEY ("taxRateId") REFERENCES "TaxRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
