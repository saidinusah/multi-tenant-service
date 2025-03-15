-- DropIndex
DROP INDEX "members_createdBy_organizationId_memberId_idx";

-- CreateIndex
CREATE INDEX "members_createdBy_organizationId_memberId_phoneNumber_idx" ON "members"("createdBy", "organizationId", "memberId", "phoneNumber");
