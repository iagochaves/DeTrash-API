/*
  Warnings:

  - Made the column `plasticKgs` on table `Form` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paperKgs` on table `Form` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metalKgs` on table `Form` required. This step will fail if there are existing NULL values in that column.
  - Made the column `glassKgs` on table `Form` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organicKgs` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "plasticKgs" SET NOT NULL,
ALTER COLUMN "paperKgs" SET NOT NULL,
ALTER COLUMN "metalKgs" SET NOT NULL,
ALTER COLUMN "glassKgs" SET NOT NULL,
ALTER COLUMN "organicKgs" SET NOT NULL;
