import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getVideoById } from "@/lib/youtube"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProgressPage() {
  const { userId } = await auth()
  
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      videoProgress: {
        where: { completed: true },
        orderBy: { lastWatched: "desc" },
        take: 5,
      },
    },
  })

  if (!user) return null

  // Fetch video titles for completed videos
  const recentCompletions = await Promise.all(
    user.videoProgress.map(async (progress) => {
      const video = await getVideoById(progress.videoId)
      return {
        ...progress,
        title: video?.title || `Video ${progress.videoId}`,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground">
          Detailed view of your learning journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-md bg-muted/30">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your learning metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-foreground/80">Total Videos Completed</span>
              <span className="font-semibold text-foreground">{user.totalVideosCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">Current Streak</span>
              <span className="font-semibold text-primary">{user.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">Best Streak</span>
              <span className="font-semibold text-chart-2">{user.bestStreak} days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-muted/30">
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
            <CardDescription>Your latest completed videos</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCompletions.length > 0 ? (
              <div className="space-y-2">
                {recentCompletions.map((completion) => (
                  <Link
                    key={completion.id}
                    href={`/dashboard/video/${completion.videoId}`}
                    className="block"
                  >
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer group">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1 mr-2">
                        {completion.title}
                      </span>
                      {completion.lastWatched && (
                        <span className="text-xs text-foreground/70 whitespace-nowrap">
                          {new Date(completion.lastWatched).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/70">
                No videos completed yet. Start learning!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

