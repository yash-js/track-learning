import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all takeaways for a video
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoProgressId = searchParams.get("videoProgressId")

    if (!videoProgressId) {
      return NextResponse.json(
        { error: "videoProgressId is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the videoProgress belongs to the user
    const videoProgress = await prisma.videoProgress.findUnique({
      where: { id: videoProgressId },
    })

    if (!videoProgress || videoProgress.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const takeaways = await prisma.keyTakeaway.findMany({
      where: { videoProgressId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, takeaways })
  } catch (error) {
    console.error("Error fetching key takeaways:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new takeaway
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { videoProgressId, content } = await request.json()

    if (!videoProgressId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "videoProgressId and content are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the videoProgress belongs to the user
    const videoProgress = await prisma.videoProgress.findUnique({
      where: { id: videoProgressId },
    })

    if (!videoProgress || videoProgress.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const takeaway = await prisma.keyTakeaway.create({
      data: {
        videoProgressId,
        content: content.trim(),
      },
    })

    return NextResponse.json({ success: true, takeaway })
  } catch (error) {
    console.error("Error creating key takeaway:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a takeaway
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const takeawayId = searchParams.get("takeawayId")

    if (!takeawayId) {
      return NextResponse.json(
        { error: "takeawayId is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the takeaway belongs to the user
    const takeaway = await prisma.keyTakeaway.findUnique({
      where: { id: takeawayId },
      include: { videoProgress: true },
    })

    if (!takeaway || takeaway.videoProgress.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.keyTakeaway.delete({
      where: { id: takeawayId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting key takeaway:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update a takeaway
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { takeawayId, content } = await request.json()

    if (!takeawayId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "takeawayId and content are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the takeaway belongs to the user
    const takeaway = await prisma.keyTakeaway.findUnique({
      where: { id: takeawayId },
      include: { videoProgress: true },
    })

    if (!takeaway || takeaway.videoProgress.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedTakeaway = await prisma.keyTakeaway.update({
      where: { id: takeawayId },
      data: {
        content: content.trim(),
      },
    })

    return NextResponse.json({ success: true, takeaway: updatedTakeaway })
  } catch (error) {
    console.error("Error updating key takeaway:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

