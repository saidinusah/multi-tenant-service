/*
  Warnings:

  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_branch_id_fkey";

-- DropTable
DROP TABLE "Branch";

-- CreateTable
CREATE TABLE "branches" (
    "id" SERIAL NOT NULL,
    "type" "BranchType" NOT NULL,
    "ghanaPostGPS" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_ghanaPostGPS_key" ON "branches"("ghanaPostGPS");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
