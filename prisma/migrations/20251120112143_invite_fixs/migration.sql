/*
  Warnings:

  - You are about to drop the column `receiverEmail` on the `Invite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "receiverEmail",
ADD COLUMN     "receiverId" TEXT NOT NULL DEFAULT 'temp-user',
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
