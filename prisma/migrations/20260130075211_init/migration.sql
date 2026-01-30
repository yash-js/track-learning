-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "playlistUrl" TEXT,
    "playlistId" TEXT,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalVideosCompleted" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoProgress" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "lastWatched" TIMESTAMP(3),
    "notes" TEXT,
    "watchPosition" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "VideoProgress_userId_idx" ON "VideoProgress"("userId");

-- CreateIndex
CREATE INDEX "VideoProgress_videoId_idx" ON "VideoProgress"("videoId");

-- CreateIndex
CREATE INDEX "VideoProgress_watchPosition_idx" ON "VideoProgress"("watchPosition");

-- CreateIndex
CREATE UNIQUE INDEX "VideoProgress_videoId_userId_key" ON "VideoProgress"("videoId", "userId");

-- AddForeignKey
ALTER TABLE "VideoProgress" ADD CONSTRAINT "VideoProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
