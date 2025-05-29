/*
  Warnings:

  - A unique constraint covering the columns `[email,businessId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_businessId_key" ON "Customer"("email", "businessId");
