-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_branch_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "branch_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
