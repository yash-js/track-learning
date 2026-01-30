import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getPlaylistVideos } from "@/lib/youtube"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Target, CheckCircle2, LucideIcon } from "lucide-react"

interface AchievementCardProps {
  icon: LucideIcon
  title: string
  description: string
  unlocked: boolean
  progress?: number
  progressLabel?: string
  iconColor?: string
  borderColor?: string
}

function AchievementCard({
  icon: Icon,
  title,
  description,
  unlocked,
  progress,
  progressLabel,
  iconColor,
  borderColor,
}: AchievementCardProps) {
  return (
    <Card className={`backdrop-blur-md transition-all relative overflow-hidden ${
      unlocked 
        ? "bg-muted/30 border-border/50" 
        : "bg-muted/30 opacity-75"
    }`}>
      {unlocked && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderColor || "bg-primary"}`} />
      )}
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${
            unlocked 
              ? iconColor || "text-primary" 
              : "text-muted-foreground"
          }`} />
          <CardTitle className={unlocked ? "text-foreground" : "text-muted-foreground"}>
            {title}
          </CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {unlocked ? (
          <div className="space-y-2">
            <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Unlocked
            </Badge>
            {progress !== undefined && progressLabel && (
              <div className="text-sm text-muted-foreground">
                {progressLabel}: {progress}%
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Coming soon</div>
            {progress !== undefined && progressLabel && (
              <div className="text-sm text-muted-foreground">
                {progressLabel}: {progress}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function AchievementsPage() {
  const { userId } = await auth()
  
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return null

  // Get playlist videos to calculate total
  const playlistId = (user as { playlistId?: string | null }).playlistId
  const playlistVideos = playlistId ? await getPlaylistVideos(playlistId) : []
  const totalVideos = playlistVideos.length || 0

  // Calculate achievements
  const firstStreakUnlocked = user.bestStreak >= 3 || user.currentStreak >= 3
  const halfwayUnlocked = totalVideos > 0 && (user.totalVideosCompleted / totalVideos) >= 0.5
  const masterUnlocked = totalVideos > 0 && user.totalVideosCompleted === totalVideos

  // Calculate progress for halfway achievement
  const halfwayProgress = totalVideos > 0 
    ? Math.round((user.totalVideosCompleted / totalVideos) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Unlock achievements as you progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AchievementCard
          icon={Flame}
          title="First Streak"
          description="Complete your first 3-day streak"
          unlocked={firstStreakUnlocked}
          progress={Math.min(user.bestStreak, 3)}
          progressLabel="Best streak"
          iconColor="text-primary"
          borderColor="bg-primary"
        />

        <AchievementCard
          icon={Target}
          title="Halfway There"
          description="Complete 50% of the playlist"
          unlocked={halfwayUnlocked}
          progress={halfwayProgress}
          progressLabel="Progress"
          iconColor="text-yellow-500"
          borderColor="bg-yellow-500"
        />

        <AchievementCard
          icon={Trophy}
          title="Master"
          description="Complete the entire playlist"
          unlocked={masterUnlocked}
          progress={totalVideos > 0 ? Math.round((user.totalVideosCompleted / totalVideos) * 100) : 0}
          progressLabel="Progress"
          iconColor="text-green-500"
          borderColor="bg-green-500"
        />
      </div>
    </div>
  )
}

