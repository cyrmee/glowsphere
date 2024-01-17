/*
  Warnings:

  - You are about to drop the column `filePath` on the `bookmarks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "filePath";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT;
