/*
  Warnings:

  - You are about to drop the column `glassInvoiceFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `glassKgs` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `glassVideoFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `metalInvoiceFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `metalKgs` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `metalVideoFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `organicInvoiceFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `organicKgs` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `organicVideoFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `paperInvoiceFilename` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `paperKgs` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `paperVideoFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `plasticInvoiceFileName` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `plasticKgs` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `plasticVideoFileName` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "glassInvoiceFileName",
DROP COLUMN "glassKgs",
DROP COLUMN "glassVideoFileName",
DROP COLUMN "metalInvoiceFileName",
DROP COLUMN "metalKgs",
DROP COLUMN "metalVideoFileName",
DROP COLUMN "organicInvoiceFileName",
DROP COLUMN "organicKgs",
DROP COLUMN "organicVideoFileName",
DROP COLUMN "paperInvoiceFilename",
DROP COLUMN "paperKgs",
DROP COLUMN "paperVideoFileName",
DROP COLUMN "plasticInvoiceFileName",
DROP COLUMN "plasticKgs",
DROP COLUMN "plasticVideoFileName";
