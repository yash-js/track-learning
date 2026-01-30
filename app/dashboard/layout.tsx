import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardClient from "@/components/dashboard/dashboard-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Ensure user exists in database
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        currentStreak: 0,
        bestStreak: 0,
        totalVideosCompleted: 0,
      },
    })
  }

  // Redirect to setup if no playlist configured
  if (!user.playlistId || !user.playlistUrl) {
    redirect("/setup")
  }

  return <DashboardClient user={user}>{children}</DashboardClient>
}

