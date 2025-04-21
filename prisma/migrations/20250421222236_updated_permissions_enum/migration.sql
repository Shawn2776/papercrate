-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_CUSTOMER';
ALTER TYPE "Permission" ADD VALUE 'VIEW_CUSTOMERS';
ALTER TYPE "Permission" ADD VALUE 'EDIT_CUSTOMER';
ALTER TYPE "Permission" ADD VALUE 'ARCHIVE_CUSTOMER';
ALTER TYPE "Permission" ADD VALUE 'DELETE_CUSTOMER';
ALTER TYPE "Permission" ADD VALUE 'DELETE_CUSTOMER_PERMANENTLY';
