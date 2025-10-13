/*
  Warnings:

  - You are about to drop the column `userId` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."services" DROP CONSTRAINT "services_userId_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "userId";

-- DropTable
DROP TABLE "public"."user";
