/*
  Warnings:

  - You are about to drop the column `onboard_reference` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "onboard_reference";
