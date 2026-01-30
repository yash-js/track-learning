import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getVideoById, getPlaylistVideos } from "@/lib/youtube"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import VideoPlayer from "@/components/video/video-player"
import VideoNotes from "@/components/video/video-notes"

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  const { id } = await params

  if (!userId) return notFound()

  const video = await getVideoById(id)
  if (!video) return notFound()

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return notFound()

  const videoProgress = await prisma.videoProgress.findUnique({
    where: {
      videoId_userId: {
        videoId: id,
        userId: user.id,
      },
    },
    include: {
      keyTakeaways: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  // Get playlist videos to find next/previous
  const playlistId = (user as { playlistId?: string | null }).playlistId
  let nextVideoId: string | null = null
  let previousVideoId: string | null = null

  if (playlistId) {
    const playlistVideos = await getPlaylistVideos(playlistId)
    const currentIndex = playlistVideos.findIndex((v) => v.videoId === id)

    if (currentIndex !== -1) {
      // Get next video (if not the last one)
      if (currentIndex < playlistVideos.length - 1) {
        nextVideoId = playlistVideos[currentIndex + 1].videoId
      }
      // Get previous video (if not the first one)
      if (currentIndex > 0) {
        previousVideoId = playlistVideos[currentIndex - 1].videoId
      }
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight line-clamp-2 sm:line-clamp-none">
            {video.title}
          </h1>
        </div>

        <Link href="/dashboard/playlist" className="flex-shrink-0">
          <Button variant="ghost" size="sm" className="gap-2 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Playlist</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1fr_400px]">
        <VideoPlayer
          videoId={video.videoId}
          title={video.title}
          videoProgressId={videoProgress?.id}
          userId={user.id}
          videoIdParam={id}
          watchPosition={videoProgress?.watchPosition ?? null}
          nextVideoId={nextVideoId}
          description={video.description || "Watch and learn from this tutorial"}
        />

        <VideoNotes
          previousVideoId={previousVideoId || undefined}
          nextVideoId={nextVideoId || undefined}
          videoProgressId={videoProgress?.id}
          userId={user.id}
          videoId={id}
          initialNotes={videoProgress?.notes || ""}
          initialTakeaways={(videoProgress?.keyTakeaways || []).map((t) => ({
            id: t.id,
            content: t.content,
            createdAt: t.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  )
}

