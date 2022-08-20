/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `playlists` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "video_playlist" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "playlists_name_key" ON "playlists"("name");
