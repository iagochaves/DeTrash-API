/*
  Warnings:

  - You are about to drop the column `documentType` on the `Document` table. All the data in the column will be lost.
  - Added the required column `residueType` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResidueType" AS ENUM ('GLASS', 'METAL', 'ORGANIC', 'PAPER', 'PLASTIC');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "documentType",
ADD COLUMN     "residueType" "ResidueType" NOT NULL;

-- DropEnum
DROP TYPE "DocumentType";
