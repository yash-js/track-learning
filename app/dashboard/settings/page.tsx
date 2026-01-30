import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton } from "@clerk/nextjs"
import { PlaylistSettings } from "@/components/dashboard/playlist-settings"

export default async function SettingsPage() {
  const { userId } = await auth()
  
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-md bg-muted/30">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Profile</span>
              <UserButton />
            </div>
          </CardContent>
        </Card>

        <PlaylistSettings playlistUrl={user.playlistUrl} />
      </div>
    </div>
  )
}

