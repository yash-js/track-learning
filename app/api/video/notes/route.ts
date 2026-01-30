import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { videoId, userId: paramUserId, videoProgressId, notes } = await request.json()

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.id !== paramUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update or create video progress with notes
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
        notes,
        lastWatched: new Date(),
      },
      create: {
        videoId,
        userId: user.id,
        notes,
        lastWatched: new Date(),
      },
    })

    return NextResponse.json({ success: true, videoProgress })
  } catch (error) {
    console.error("Error saving notes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

