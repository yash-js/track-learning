import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { shouldResetStreak, calculateStreak } from "@/lib/utils"
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
  } else {
    // Check if streak should be reset due to inactivity
    if (shouldResetStreak(user.lastActiveAt)) {
      // Reset streak to 0 if user hasn't been active for more than 1 day
      const newStreak = calculateStreak(user.currentStreak, user.lastActiveAt, false)
      
      if (newStreak !== user.currentStreak) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            currentStreak: newStreak,
          },
        })
      }
    }
  }

  // Redirect to setup if no playlist configured
  if (!user.playlistId || !user.playlistUrl) {
    redirect("/setup")
  }

  return <DashboardClient user={user}>{children}</DashboardClient>
}

