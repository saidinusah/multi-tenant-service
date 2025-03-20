/*
  Warnings:

  - You are about to drop the column `created_at` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `ghana_post_gps` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_BranchToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrganizationToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[branchId]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ghanaPostGPS]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleId]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `branchId` was added to the `branches` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ghanaPostGPS` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - The required column `organizationId` was added to the `organizations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `phoneNumber` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - The required column `roleId` was added to the `roles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `name` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `foreNames` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPER_ADMIN', 'BACKOFFICE_ADMIN', 'MEMBER', 'TRAINER');

-- CreateEnum
CREATE TYPE "RenewalPeriods" AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'BI_ANNUALLY', 'ANNUALLY');

-- DropForeignKey
ALTER TABLE "_BranchToUser" DROP CONSTRAINT "_BranchToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BranchToUser" DROP CONSTRAINT "_BranchToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_organization_id_fkey";

-- DropIndex
DROP INDEX "organizations_ghana_post_gps_key";

-- DropIndex
DROP INDEX "organizations_phone_number_key";

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "created_at",
DROP COLUMN "organization_id",
DROP COLUMN "updated_at",
ADD COLUMN     "branchId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "organizationId" UUID,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "created_at",
DROP COLUMN "ghana_post_gps",
DROP COLUMN "phone_number",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ghanaPostGPS" TEXT NOT NULL,
ADD COLUMN     "organizationId" UUID NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roleId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
DROP COLUMN "name",
ADD COLUMN     "name" "Roles" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "phone_number",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "foreNames" TEXT NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "organizationId" UUID,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "_BranchToUser";

-- DropTable
DROP TABLE "_OrganizationToUser";

-- DropTable
DROP TABLE "_RoleToUser";

-- CreateTable
CREATE TABLE "subscription_packages" (
    "id" SERIAL NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdBy" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "renewalPeriod" TEXT NOT NULL,

    CONSTRAINT "subscription_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "memberId" UUID NOT NULL,
    "foreNames" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "createdBy" UUID NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "organizationId" UUID NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_packages_subscriptionId_key" ON "subscription_packages"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "members_memberId_key" ON "members"("memberId");

-- CreateIndex
CREATE INDEX "members_createdBy_organizationId_memberId_idx" ON "members"("createdBy", "organizationId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "branches_branchId_key" ON "branches"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_ghanaPostGPS_key" ON "organizations"("ghanaPostGPS");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_phoneNumber_key" ON "organizations"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_organizationId_key" ON "organizations"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_roleId_key" ON "roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("organizationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("organizationId") ON DELETE SET NULL ON UPDATE CASCADE;
