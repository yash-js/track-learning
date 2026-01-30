"use client"

import dynamic from "next/dynamic"
import { Flame, Menu } from "lucide-react"
import { User } from "@/app/generated/prisma/client"
import { Button } from "@/components/ui/button"

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
)

interface HeaderProps {
  user: User
  onMenuClick?: () => void
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-muted/30 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger Menu Button - Mobile Only */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 sm:px-4 py-2">
          <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="text-xs sm:text-sm font-medium">
            {user.currentStreak} Day Streak
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "bg-card border-border",
              userButtonPopoverActionButton: "text-foreground hover:bg-muted",
              userButtonPopoverActionButtonText: "text-foreground",
              userPreviewMainIdentifier: "text-foreground",
              userPreviewSecondaryIdentifier: "text-muted-foreground",
            },
            variables: {
              colorBackground: "var(--card)",
              colorText: "var(--foreground)",
              colorTextSecondary: "var(--muted-foreground)",
              colorPrimary: "var(--primary)",
              colorDanger: "var(--destructive)",
              borderRadius: "0.75rem",
            },
          }}
        />
      </div>
    </header>
  )
}

