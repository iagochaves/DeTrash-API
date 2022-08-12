/*
  Warnings:

  - You are about to drop the column `recyclerVideoFileName` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "recyclerVideoFileName",
ADD COLUMN     "glassVideoFileName" TEXT,
ADD COLUMN     "metalVideoFileName" TEXT,
ADD COLUMN     "organicVideoFileName" TEXT,
ADD COLUMN     "paperVideoFileName" TEXT,
ADD COLUMN     "plasticVideoFileName" TEXT;
