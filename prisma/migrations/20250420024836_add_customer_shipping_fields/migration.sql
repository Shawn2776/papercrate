-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "billingAddressLine1" TEXT,
ADD COLUMN     "billingAddressLine2" TEXT,
ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingState" TEXT,
ADD COLUMN     "billingZip" TEXT,
ADD COLUMN     "shippingAddressLine1" TEXT,
ADD COLUMN     "shippingAddressLine2" TEXT,
ADD COLUMN     "shippingCity" TEXT,
ADD COLUMN     "shippingState" TEXT,
ADD COLUMN     "shippingZip" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" SET DATA TYPE TEXT;
