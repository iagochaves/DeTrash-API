-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('GLASS', 'METAL', 'ORGANIC', 'PAPER', 'PLASTIC');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "videoFileName" TEXT,
    "invoicesFileName" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
