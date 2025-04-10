/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `recordId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `table` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Product` table. All the data in the column will be lost.
  - Added the required column `entityId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('INVITE_USERS', 'MANAGE_USERS', 'ASSIGN_ROLES', 'ASSIGN_PERMISSIONS', 'VIEW_TENANT_SETTINGS', 'UPDATE_TENANT_SETTINGS', 'CREATE_PRODUCT', 'VIEW_PRODUCTS', 'EDIT_PRODUCT', 'ARCHIVE_PRODUCT', 'DELETE_PRODUCT', 'DELETE_PRODUCT_PERMANENTLY', 'CREATE_ORDER', 'VIEW_ORDERS', 'EDIT_ORDER', 'CANCEL_ORDER', 'DELETE_ORDER', 'DELETE_ORDER_PERMANENTLY', 'CREATE_INVOICE', 'VIEW_INVOICES', 'EDIT_INVOICE', 'DELETE_INVOICE', 'DELETE_INVOICE_PERMANENTLY', 'RESTORE_INVOICE', 'VIEW_PAYMENTS', 'REFUND_PAYMENT', 'EXPORT_DATA', 'MANAGE_BILLING', 'VIEW_AUDIT_LOGS', 'ACCESS_BETA_FEATURES', 'PLATFORM_ADMIN', 'DELETE_PERMANENTLY', 'PURGE_ARCHIVED_DATA');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TenantRole" ADD VALUE 'MANAGER';
ALTER TYPE "TenantRole" ADD VALUE 'VIEWER';
ALTER TYPE "TenantRole" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "createdAt",
DROP COLUMN "data",
DROP COLUMN "recordId",
DROP COLUMN "table",
ADD COLUMN     "after" JSONB,
ADD COLUMN     "before" JSONB,
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "entityType" TEXT NOT NULL,
ADD COLUMN     "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "TenantMembership" ADD COLUMN     "permissions" "Permission"[] DEFAULT ARRAY[]::"Permission"[];
