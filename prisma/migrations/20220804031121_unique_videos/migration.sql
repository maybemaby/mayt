/*
  Warnings:

  - A unique constraint covering the columns `[ytId]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "videos_ytId_key" ON "videos"("ytId");
