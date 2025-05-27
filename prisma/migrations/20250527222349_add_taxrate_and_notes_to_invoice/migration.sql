-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "taxRateId" TEXT,
ADD COLUMN     "taxRatePercent" DECIMAL(5,2);
