import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { after } from "next/server"
import { calculateStreak } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { videoId, userId: paramUserId, videoProgressId, completed = true } = await request.json()

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.id !== paramUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if video was already completed
    const existingProgress = await prisma.videoProgress.findUnique({
      where: videoProgressId
        ? { id: videoProgressId }
        : {
            videoId_userId: {
              videoId,
              userId: user.id,
            },
          },
    })

    const wasAlreadyCompleted = existingProgress?.completed ?? false
    const isCompleting = completed === true
    const isUncompleting = completed === false

    // Update or create video progress
    const videoProgress = await prisma.videoProgress.upsert({
      where: videoProgressId
        ? { id: videoProgressId }
        : {
            videoId_userId: {
              videoId,
              userId: user.id,
            },
          },
      update: {
        completed: completed,
        lastWatched: new Date(),
      },
      create: {
        videoId,
        userId: user.id,
        completed: completed,
        lastWatched: new Date(),
      },
    })

    // Use Next.js 16 after() API to handle streak calculation in background
    after(async () => {
      try {
        // Only update progress and streak if this is the first time completing the video
        if (isCompleting && !wasAlreadyCompleted) {
          // Update total videos completed
          await prisma.user.update({
            where: { id: user.id },
            data: {
              totalVideosCompleted: {
                increment: 1,
              },
            },
          })

          // Calculate streak - only update if this is a new completion
          const now = new Date()
          const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null
          
          // Use utility function to calculate new streak
          const newStreak = calculateStreak(user.currentStreak, lastActive, true)
          const bestStreak = Math.max(user.bestStreak, newStreak)

          await prisma.user.update({
            where: { id: user.id },
            data: {
              currentStreak: newStreak,
              bestStreak,
              lastActiveAt: now,
            },
          })
        }
        
        // If uncompleting, decrement total videos completed
        if (isUncompleting && wasAlreadyCompleted) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              totalVideosCompleted: {
                decrement: 1,
              },
            },
          })
        }
        // If video was already completed, don't update streak or progress
      } catch (error) {
        console.error("Error updating streak:", error)
      }
    })

    return NextResponse.json({ success: true, videoProgress })
  } catch (error) {
    console.error("Error completing video:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

