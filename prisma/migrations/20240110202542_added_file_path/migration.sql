/*
  Warnings:

  - Added the required column `filePath` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "filePath" TEXT NOT NULL;
