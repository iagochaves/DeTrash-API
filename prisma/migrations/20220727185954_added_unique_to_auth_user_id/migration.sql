/*
  Warnings:

  - A unique constraint covering the columns `[authUserId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_authUserId_key" ON "Users"("authUserId");
