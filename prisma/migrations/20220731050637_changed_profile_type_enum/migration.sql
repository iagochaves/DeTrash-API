/*
  Warnings:

  - The values [recycler,waste_generator,hodler] on the enum `ProfileType` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `profileType` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProfileType_new" AS ENUM ('HODLER', 'RECYCLER', 'WASTE_GENERATOR');
ALTER TABLE "User" ALTER COLUMN "profileType" TYPE "ProfileType_new" USING ("profileType"::text::"ProfileType_new");
ALTER TYPE "ProfileType" RENAME TO "ProfileType_old";
ALTER TYPE "ProfileType_new" RENAME TO "ProfileType";
DROP TYPE "ProfileType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileType" SET NOT NULL;
