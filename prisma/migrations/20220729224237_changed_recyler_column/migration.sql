/*
  Warnings:

  - You are about to drop the column `recyclerVideoUrl` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "recyclerVideoUrl",
ADD COLUMN     "recyclerVideoFileName" TEXT;
