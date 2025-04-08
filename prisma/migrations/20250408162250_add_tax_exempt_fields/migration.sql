-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "taxExempt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxExemptId" TEXT;
