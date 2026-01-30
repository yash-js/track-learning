import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Handle both JSON and Blob (from sendBeacon) requests
    const contentType = request.headers.get("content-type") || ""
    let body: {
      videoId?: string
      userId?: string
      videoProgressId?: string
      currentTime?: number
    }
    
    if (contentType.includes("application/json")) {
      body = await request.json()
    } else {
      // Handle Blob from sendBeacon
      const blob = await request.blob()
      const text = await blob.text()
      body = JSON.parse(text)
    }

    const { videoId, userId: paramUserId, videoProgressId, currentTime } = body

    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      )
    }

    if (typeof currentTime !== "number" || currentTime < 0) {
      return NextResponse.json(
        { error: "Invalid currentTime" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.id !== paramUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update or create video progress with current time
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
        watchPosition: currentTime,
        lastWatched: new Date(),
      },
      create: {
        videoId,
        userId: user.id,
        watchPosition: currentTime,
        lastWatched: new Date(),
      },
    })

    return NextResponse.json({ success: true, videoProgress })
  } catch (error) {
    console.error("Error saving video position:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

