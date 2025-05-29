-- CreateTable
CREATE TABLE "InvoiceAccessToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceAccessToken_token_key" ON "InvoiceAccessToken"("token");

-- AddForeignKey
ALTER TABLE "InvoiceAccessToken" ADD CONSTRAINT "InvoiceAccessToken_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
