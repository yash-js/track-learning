/*
  Warnings:

  - You are about to drop the `TimelineBookmark` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimelineBookmark" DROP CONSTRAINT "TimelineBookmark_videoProgressId_fkey";

-- DropTable
DROP TABLE "TimelineBookmark";

-- CreateTable
CREATE TABLE "KeyTakeaway" (
    "id" TEXT NOT NULL,
    "videoProgressId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyTakeaway_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KeyTakeaway_videoProgressId_idx" ON "KeyTakeaway"("videoProgressId");

-- AddForeignKey
ALTER TABLE "KeyTakeaway" ADD CONSTRAINT "KeyTakeaway_videoProgressId_fkey" FOREIGN KEY ("videoProgressId") REFERENCES "VideoProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
