"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"

interface DashboardClientProps {
  user: User
  children: React.ReactNode
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden w-full lg:w-auto">
        <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}

