import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getPlaylistVideos } from "@/lib/youtube"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Play, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      videoProgress: true,
    },
  })

  if (!user) return null

  const playlistVideos = user.playlistId 
    ? await getPlaylistVideos(user.playlistId)
    : []
  const totalVideos = playlistVideos.length || 0
  const completionPercentage = totalVideos > 0
    ? Math.round((user.totalVideosCompleted / totalVideos) * 100)
    : 0

  // Find the next video to watch
  const progressMap = new Map(
    user.videoProgress.map((vp) => [vp.videoId, vp])
  )

  // Find first incomplete video (or first video if none started)
  const nextVideo = playlistVideos.find(
    (video) => !progressMap.get(video.videoId)?.completed
  ) || playlistVideos[0]

  const hasStarted = user.videoProgress.length > 0

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Continue your learning journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Streak Card */}
        <Card className="group relative overflow-hidden backdrop-blur-md bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/20 p-2 group-hover:bg-primary/30 transition-colors">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              Current Streak
            </CardTitle>
            <CardDescription>Days of consistent learning</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold bg-gradient-to-br from-primary to-chart-2 bg-clip-text text-transparent">
              {user.currentStreak}
            </div>
            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
              Best: {user.bestStreak} days
            </p>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="group relative overflow-hidden backdrop-blur-md bg-card/50 border-chart-2/20 hover:border-chart-2/40 transition-all duration-300 hover:shadow-xl hover:shadow-chart-2/20 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle>Progress</CardTitle>
            <CardDescription>Videos completed</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold bg-gradient-to-br from-chart-2 to-chart-3 bg-clip-text text-transparent">
              {user.totalVideosCompleted}
            </div>
            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
              {completionPercentage}% of playlist
            </p>
          </CardContent>
        </Card>

        {/* Course Progress Card */}
        <Card className="group relative overflow-hidden backdrop-blur-md bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-2/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Overall completion</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-lg font-bold text-primary">{completionPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary via-chart-2 to-primary transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue/Start Section */}
      {nextVideo && (
        <Card className="group relative overflow-hidden backdrop-blur-md bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-0 relative">
            <div className="grid md:grid-cols-[350px_1fr] gap-0">
              {/* Thumbnail */}
              <div className="relative aspect-video md:aspect-auto md:h-full min-h-[220px] overflow-hidden">
                {nextVideo.thumbnail && (
                  <Image
                    src={nextVideo.thumbnail}
                    alt={nextVideo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <div className="rounded-full bg-white/20 backdrop-blur-md p-5 group-hover:scale-110 group-hover:bg-white/30 transition-all shadow-xl">
                    <Play className="h-10 w-10 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between bg-gradient-to-br from-card/50 to-card/30">
                <div className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {hasStarted ? "Continue Learning" : "Start Learning"}
                      </span>
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {hasStarted ? "Pick up where you left off" : "Begin your learning journey"}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Your next video is ready
                    </CardDescription>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="font-bold text-xl line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                      {nextVideo.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{nextVideo.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href={`/dashboard/video/${nextVideo.videoId}`} className="mt-6">
                  <Button size="lg" className="w-full md:w-auto gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all">
                    {hasStarted ? (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Now
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

