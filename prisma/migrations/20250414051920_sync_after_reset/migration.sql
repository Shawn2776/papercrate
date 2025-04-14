/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `autoResetYearly` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `defaultTaxRateId` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceCounter` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceFormat` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `invoicePrefix` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `isInvoiceSetup` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `isUspsValidated` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `lastResetYear` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `zipPlus4` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BankDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductIdentifier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShippingDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaxRate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZipCache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZipCity` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'ADMIN';
ALTER TYPE "Role" ADD VALUE 'AUDITOR';
ALTER TYPE "Role" ADD VALUE 'MARKETING';
ALTER TYPE "Role" ADD VALUE 'BILLING_MANAGER';
ALTER TYPE "Role" ADD VALUE 'NONE';

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_parentInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_soldByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_discountId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_productId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_taxId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceSettings" DROP CONSTRAINT "InvoiceSettings_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceVersion" DROP CONSTRAINT "InvoiceVersion_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "ProductIdentifier" DROP CONSTRAINT "ProductIdentifier_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingDetail" DROP CONSTRAINT "ShippingDetail_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ShippingDetail" DROP CONSTRAINT "ShippingDetail_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingDetail" DROP CONSTRAINT "ShippingDetail_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "TaxRate" DROP CONSTRAINT "TaxRate_createdById_fkey";

-- DropForeignKey
ALTER TABLE "TaxRate" DROP CONSTRAINT "TaxRate_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_defaultTaxRateId_fkey";

-- DropForeignKey
ALTER TABLE "ZipCity" DROP CONSTRAINT "ZipCity_zipCode_fkey";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "autoResetYearly",
DROP COLUMN "city",
DROP COLUMN "companyName",
DROP COLUMN "defaultTaxRateId",
DROP COLUMN "deleted",
DROP COLUMN "email",
DROP COLUMN "invoiceCounter",
DROP COLUMN "invoiceFormat",
DROP COLUMN "invoicePrefix",
DROP COLUMN "isInvoiceSetup",
DROP COLUMN "isUspsValidated",
DROP COLUMN "lastResetYear",
DROP COLUMN "state",
DROP COLUMN "website",
DROP COLUMN "zip",
DROP COLUMN "zipPlus4";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "BankDetail";

-- DropTable
DROP TABLE "Business";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Discount";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "InvoiceDetail";

-- DropTable
DROP TABLE "InvoiceSettings";

-- DropTable
DROP TABLE "InvoiceVersion";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PaymentLog";

-- DropTable
DROP TABLE "PaymentMethod";

-- DropTable
DROP TABLE "PaymentStatus";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductIdentifier";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "ShippingDetail";

-- DropTable
DROP TABLE "TaxRate";

-- DropTable
DROP TABLE "ZipCache";

-- DropTable
DROP TABLE "ZipCity";
