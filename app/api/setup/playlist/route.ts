import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { playlistUrl, playlistId } = await request.json()

    if (!playlistUrl || !playlistId) {
      return NextResponse.json(
        { error: "Playlist URL and ID are required" },
        { status: 400 }
      )
    }

    // Validate playlist URL format
    const isValidYouTubeUrl = 
      (typeof playlistUrl === "string" && 
       (playlistUrl.includes("youtube.com") || playlistUrl.includes("youtu.be")))

    if (!isValidYouTubeUrl) {
      return NextResponse.json(
        { error: "Invalid YouTube playlist URL" },
        { status: 400 }
      )
    }

    // Validate playlist ID format (should be alphanumeric with dashes/underscores, at least 5 chars)
    const isValidPlaylistId = 
      typeof playlistId === "string" && 
      /^[a-zA-Z0-9_-]{5,}$/.test(playlistId)

    if (!isValidPlaylistId) {
      return NextResponse.json(
        { error: "Invalid playlist ID format" },
        { status: 400 }
      )
    }

    // Re-extract playlist ID from URL to verify it matches
    const extractPlaylistId = (url: string): string | null => {
      const patterns = [
        /[?&]list=([a-zA-Z0-9_-]{5,})/,
        /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]{5,})/,
        /youtu\.be\/.*[?&]list=([a-zA-Z0-9_-]{5,})/,
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
          return match[1]
        }
      }
      return null
    }

    const extractedId = extractPlaylistId(playlistUrl)
    if (!extractedId || extractedId !== playlistId) {
      return NextResponse.json(
        { error: "Playlist ID does not match the provided URL" },
        { status: 400 }
      )
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          playlistUrl,
          playlistId,
          currentStreak: 0,
          bestStreak: 0,
          totalVideosCompleted: 0,
        },
      })
    } else {
      // Check if playlist is changing
      const isPlaylistChanging = user.playlistId && user.playlistId !== playlistId

      // If playlist is changing, clear all video progress
      if (isPlaylistChanging) {
        await prisma.videoProgress.deleteMany({
          where: { userId: user.id },
        })
      }

      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          playlistUrl,
          playlistId,
          // Reset progress if playlist changed
          ...(isPlaylistChanging && {
            totalVideosCompleted: 0,
            currentStreak: 0,
            // Keep bestStreak as it's a lifetime achievement
          }),
        },
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error saving playlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

