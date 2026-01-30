"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PlayCircle,
  BookOpen,
  Trophy,
  Settings,
  X,
} from "lucide-react"
import LearningTrackerIcon from "@/components/icons/learning-tracker-icon"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Playlist", href: "/dashboard/playlist", icon: PlayCircle },
  { name: "Progress", href: "/dashboard/progress", icon: BookOpen },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <LearningTrackerIcon className="h-7 w-7 text-primary" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Learning Tracker
          </h2>
        </div>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          Track your learning progress
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen w-64 border-r border-border bg-muted/30 backdrop-blur-md">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-muted/30 backdrop-blur-md transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

