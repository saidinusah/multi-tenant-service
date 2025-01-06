/*
  Warnings:

  - The primary key for the `organization_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organization_id` on the `organization_user` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `organization_user` table. All the data in the column will be lost.
  - The primary key for the `role_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `organization_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `organization_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('HEAD_OFFICE', 'SUB');

-- DropForeignKey
ALTER TABLE "organization_user" DROP CONSTRAINT "organization_user_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_user" DROP CONSTRAINT "organization_user_user_id_fkey";

-- AlterTable
ALTER TABLE "organization_user" DROP CONSTRAINT "organization_user_pkey",
DROP COLUMN "organization_id",
DROP COLUMN "user_id",
ADD COLUMN     "organizationId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "organization_user_pkey" PRIMARY KEY ("userId", "organizationId");

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "onboard_reference" TEXT;

-- AlterTable
ALTER TABLE "role_user" DROP CONSTRAINT "role_user_pkey",
ADD CONSTRAINT "role_user_pkey" PRIMARY KEY ("role_id", "user_id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "branch_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "type" "BranchType" NOT NULL,
    "ghanaPostGPS" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_ghanaPostGPS_key" ON "Branch"("ghanaPostGPS");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_user" ADD CONSTRAINT "organization_user_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_user" ADD CONSTRAINT "organization_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
