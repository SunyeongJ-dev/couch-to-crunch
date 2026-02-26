/*
  Warnings:

  - You are about to drop the column `youtubeId` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,videoId]` on the table `UserSavedVideo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserSavedVideo" DROP CONSTRAINT "UserSavedVideo_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSavedVideo" DROP CONSTRAINT "UserSavedVideo_videoId_fkey";

-- DropIndex
DROP INDEX "Video_youtubeId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DEFAULT 'Unknown',
ALTER COLUMN "image" SET DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "youtubeId";

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedVideo_userId_videoId_key" ON "UserSavedVideo"("userId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");

-- AddForeignKey
ALTER TABLE "UserSavedVideo" ADD CONSTRAINT "UserSavedVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedVideo" ADD CONSTRAINT "UserSavedVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
