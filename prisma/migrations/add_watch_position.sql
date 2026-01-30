-- Add watchPosition field to VideoProgress table
-- This migration adds a column to track the current watch position (in seconds) for each video

ALTER TABLE "VideoProgress" 
ADD COLUMN IF NOT EXISTS "watchPosition" DOUBLE PRECISION;

-- Create an index for faster queries on watchPosition
CREATE INDEX IF NOT EXISTS "VideoProgress_watchPosition_idx" ON "VideoProgress"("watchPosition");

