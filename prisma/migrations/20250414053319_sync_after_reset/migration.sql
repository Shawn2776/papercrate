-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "autoResetYearly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "defaultTaxRateId" INTEGER,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "invoiceCounter" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "invoiceFormat" TEXT,
ADD COLUMN     "invoicePrefix" TEXT,
ADD COLUMN     "isInvoiceSetup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUspsValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastResetYear" INTEGER,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "zip" TEXT,
ADD COLUMN     "zipPlus4" TEXT;

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "number" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "paymentType" "PaymentType",
    "orderId" TEXT,
    "parentInvoiceId" TEXT,
    "taxExempt" BOOLEAN NOT NULL DEFAULT false,
    "taxExemptId" TEXT,
    "customerId" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "soldByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120),
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(20),
    "imageUrl" TEXT,
    "sku" VARCHAR(50),
    "barcode" VARCHAR(100),
    "qrCodeUrl" TEXT,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "stockAlertAt" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "variant" TEXT,
    "category" VARCHAR(100),
    "tags" TEXT[],
    "primaryIdentifierType" "ProductIdentifierType",
    "primaryIdentifierValue" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductIdentifier" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" "ProductIdentifierType" NOT NULL,
    "value" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "ProductIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "barcode" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "specs" JSONB,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceVersion" (
    "id" SERIAL NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" TEXT NOT NULL,

    CONSTRAINT "InvoiceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "payload" JSONB,
    "userId" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "businessCategory" TEXT NOT NULL,
    "businessSubcategory" TEXT NOT NULL,
    "legalBusinessName" TEXT NOT NULL,
    "doingBusinessAs" TEXT,
    "ein" TEXT NOT NULL,
    "businessState" TEXT NOT NULL,
    "onlineStatus" TEXT NOT NULL,
    "onlineLink" TEXT,
    "businessEmail" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" INTEGER,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "variant" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "specs" JSONB,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetail" (
    "id" SERIAL NOT NULL,
    "bankName" VARCHAR(100) NOT NULL,
    "accountNumber" VARCHAR(50) NOT NULL,
    "iban" VARCHAR(50) NOT NULL,
    "bic" VARCHAR(50) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BankDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "discountValue" DECIMAL(5,2) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingDetail" (
    "id" SERIAL NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "shippingDate" TIMESTAMP(3) NOT NULL,
    "estimatedArrival" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShippingDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRate" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceDetail" (
    "id" SERIAL NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "taxId" INTEGER,
    "discountId" INTEGER,
    "lineTotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "InvoiceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "layout" TEXT NOT NULL DEFAULT 'classic',
    "primaryColor" TEXT NOT NULL DEFAULT '#1E3A8A',
    "includeCustomerInfo" BOOLEAN NOT NULL DEFAULT true,
    "includePaymentTerms" BOOLEAN NOT NULL DEFAULT true,
    "includeDueDate" BOOLEAN NOT NULL DEFAULT true,
    "includeNotes" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InvoiceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "method" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "reference" VARCHAR(255),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logMessage" VARCHAR(255) NOT NULL,

    CONSTRAINT "PaymentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentStatus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PaymentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZipCache" (
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'test',
    "state" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZipCache_pkey" PRIMARY KEY ("zip")
);

-- CreateTable
CREATE TABLE "ZipCity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'state',
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "ZipCity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Product_tenantId_name_key" ON "Product"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_tenantId_slug_key" ON "Product"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "ProductIdentifier_productId_idx" ON "ProductIdentifier"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_tenantId_idx" ON "Order"("tenantId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tenantId_email_key" ON "Customer"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceSettings_tenantId_key" ON "InvoiceSettings"("tenantId");

-- CreateIndex
CREATE INDEX "ZipCity_zipCode_idx" ON "ZipCity"("zipCode");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_soldByUserId_fkey" FOREIGN KEY ("soldByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_parentInvoiceId_fkey" FOREIGN KEY ("parentInvoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductIdentifier" ADD CONSTRAINT "ProductIdentifier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_defaultTaxRateId_fkey" FOREIGN KEY ("defaultTaxRateId") REFERENCES "TaxRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceVersion" ADD CONSTRAINT "InvoiceVersion_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingDetail" ADD CONSTRAINT "ShippingDetail_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingDetail" ADD CONSTRAINT "ShippingDetail_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingDetail" ADD CONSTRAINT "ShippingDetail_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRate" ADD CONSTRAINT "TaxRate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRate" ADD CONSTRAINT "TaxRate_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "TaxRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceSettings" ADD CONSTRAINT "InvoiceSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZipCity" ADD CONSTRAINT "ZipCity_zipCode_fkey" FOREIGN KEY ("zipCode") REFERENCES "ZipCache"("zip") ON DELETE RESTRICT ON UPDATE CASCADE;
