-- CreateTable
CREATE TABLE "TimelineBookmark" (
    "id" TEXT NOT NULL,
    "videoProgressId" TEXT NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimelineBookmark_videoProgressId_idx" ON "TimelineBookmark"("videoProgressId");

-- CreateIndex
CREATE INDEX "TimelineBookmark_timestamp_idx" ON "TimelineBookmark"("timestamp");

-- AddForeignKey
ALTER TABLE "TimelineBookmark" ADD CONSTRAINT "TimelineBookmark_videoProgressId_fkey" FOREIGN KEY ("videoProgressId") REFERENCES "VideoProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
