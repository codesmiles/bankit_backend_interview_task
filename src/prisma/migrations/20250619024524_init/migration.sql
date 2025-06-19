/*
  Warnings:

  - You are about to alter the column `user_id` on the `Transfer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.

*/
-- DropIndex
DROP INDEX "Transfer_user_id_key";

-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(36);
