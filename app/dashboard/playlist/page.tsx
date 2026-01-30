import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getPlaylistVideos } from "@/lib/youtube"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Play, Clock, Video, PlayCircle } from "lucide-react"
import Image from "next/image"
import PlaylistTabs from "@/components/dashboard/playlist-tabs"

export default async function PlaylistPage() {
  const { userId } = await auth()
  
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      videoProgress: true,
    },
  })

  if (!user) return null

  // If user.playlistId doesn't exist on the type, try fallback handling.
  const playlistId = (user as { playlistId?: string | null }).playlistId
  if (!playlistId) return null

  const playlistVideos = await getPlaylistVideos(playlistId)
  const progressMap = new Map(
    user.videoProgress.map((vp) => [vp.videoId, vp])
  )

  // Separate completed and incomplete videos
  const completedVideos = playlistVideos.filter(
    (video) => progressMap.get(video.videoId)?.completed
  )
  const incompleteVideos = playlistVideos.filter(
    (video) => !progressMap.get(video.videoId)?.completed
  )

  // Find the video to continue watching
  // Priority: 1) Last watched incomplete video, 2) First incomplete video, 3) First video
  const lastWatchedProgress = user.videoProgress
    .filter((vp) => !vp.completed && vp.lastWatched)
    .sort((a, b) => {
      const dateA = a.lastWatched ? new Date(a.lastWatched).getTime() : 0
      const dateB = b.lastWatched ? new Date(b.lastWatched).getTime() : 0
      return dateB - dateA
    })[0]

  const continueVideo = lastWatchedProgress
    ? playlistVideos.find((v) => v.videoId === lastWatchedProgress.videoId)
    : incompleteVideos[0] || playlistVideos[0]

  const hasStarted = user.videoProgress.length > 0

  const VideoCard = ({ video }: { video: typeof playlistVideos[0] }) => {
    const progress = progressMap.get(video.videoId)
    const isCompleted = progress?.completed ?? false

    return (
      <Link href={`/dashboard/video/${video.videoId}`}>
        <Card className="mb-4 group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-md hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-chart-2/0 group-hover:from-primary/5 group-hover:via-primary/3 group-hover:to-chart-2/5 transition-all duration-300" />
          <CardContent className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5">
            {/* Thumbnail */}
            <div className="flex-shrink-0 relative w-full sm:w-40 h-32 sm:h-24 rounded-xl overflow-hidden shadow-lg ring-1 ring-border/50 group-hover:ring-primary/50 transition-all">
              {video.thumbnail && (
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                <div className="rounded-full bg-white/20 backdrop-blur-sm p-2 group-hover:bg-primary/80 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                </div>
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2 w-full sm:w-auto">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <div className="relative">
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-chart-2" />
                      <div className="absolute inset-0 bg-chart-2/20 rounded-full blur-md" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                      <Video className="h-3 w-3 mr-1" />
                      Video
                    </Badge>
                    {isCompleted && (
                      <Badge variant="default" className="text-xs py-0 px-2 h-5 bg-chart-2 text-white border-chart-2">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow indicator */}
            <div className="flex-shrink-0 opacity-0 sm:opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
              <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                <Play className="h-4 w-4 text-primary " />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-4 sm:space-y-6">
        {/* Title and Continue Button Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 backdrop-blur-sm shadow-lg">
              <Video className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Your Playlist
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Track your learning progress
              </p>
            </div>
          </div>
          
          {/* Continue/Start Button */}
          {continueVideo && (
            <Link href={`/dashboard/video/${continueVideo.videoId}`} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all gap-2"
              >
                <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">
                  {hasStarted ? "Continue Watching" : "Start Learning"}
                </span>
              </Button>
            </Link>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Badge variant="outline" className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3">
            {playlistVideos.length} Total Videos
          </Badge>
          <Badge variant="secondary" className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3">
            {completedVideos.length} Completed
          </Badge>
          <Badge variant="outline" className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3">
            {incompleteVideos.length} Remaining
          </Badge>
        </div>
      </div>

      {playlistVideos.length === 0 ? (
        <Card className="backdrop-blur-md bg-muted/30 border-border/50">
          <CardContent className="p-12 text-center">
            <div className="space-y-3">
              <Video className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">
                {process.env.YOUTUBE_API_KEY
                  ? "Loading playlist..."
                  : "Please set YOUTUBE_API_KEY in your environment variables"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <PlaylistTabs
          allCount={playlistVideos.length}
          incompleteCount={incompleteVideos.length}
          completedCount={completedVideos.length}
          allContent={
            <div className="space-y-3">
              {playlistVideos.length === 0 ? (
                <Card className="backdrop-blur-md bg-muted/30 border-border/50">
                  <CardContent className="p-12 text-center">
                    <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No videos found</h3>
                    <p className="text-muted-foreground">
                      Your playlist appears to be empty
                    </p>
                  </CardContent>
                </Card>
              ) : (
                playlistVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))
              )}
            </div>
          }
          incompleteContent={
            <div className="space-y-3">
              {incompleteVideos.length === 0 ? (
                <Card className="backdrop-blur-md bg-muted/30 border-border/50">
                  <CardContent className="p-12 text-center">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-secondary opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">All caught up! 🎉</h3>
                    <p className="text-muted-foreground">
                      You&apos;ve completed all videos in your playlist
                    </p>
                  </CardContent>
                </Card>
              ) : (
                incompleteVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))
              )}
            </div>
          }
          completedContent={
            <div className="space-y-3">
              {completedVideos.length === 0 ? (
                <Card className="backdrop-blur-md bg-muted/30 border-border/50">
                  <CardContent className="p-12 text-center">
                    <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Start your journey</h3>
                    <p className="text-muted-foreground">
                      Complete videos to see them here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                completedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))
              )}
            </div>
          }
        />
      )}
    </div>
  )
}

