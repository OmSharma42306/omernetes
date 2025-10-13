/*
  Warnings:

  - A unique constraint covering the columns `[version,userId]` on the table `Config` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,configId]` on the table `Services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Config_version_userId_key" ON "Config"("version", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Services_name_configId_key" ON "Services"("name", "configId");

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
