-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "importLogId" INTEGER,
ADD COLUMN     "msc" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductImportLog" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "totalItems" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ProductImportLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_importLogId_fkey" FOREIGN KEY ("importLogId") REFERENCES "ProductImportLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
