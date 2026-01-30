"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Video } from "lucide-react"
import { useState } from "react"

interface PlaylistTabsProps {
  allCount: number
  incompleteCount: number
  completedCount: number
  allContent: React.ReactNode
  incompleteContent: React.ReactNode
  completedContent: React.ReactNode
}

export default function PlaylistTabs({
  allCount,
  incompleteCount,
  completedCount,
  allContent,
  incompleteContent,
  completedContent,
}: PlaylistTabsProps) {
  const [activeTab, setActiveTab] = useState("incomplete")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-4 backdrop-blur-sm p-1 sm:p-1.5 gap-1 sm:gap-1.5">
        <TabsTrigger 
          value="all" 
          className={`flex items-center justify-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${activeTab === "all" ? "text-white" : "text-blue-400"}`} />
          <span className="hidden sm:inline">All</span>
          <Badge 
            variant="outline" 
            className={`ml-0.5 sm:ml-1 h-4 sm:h-5 px-1 sm:px-1.5 text-[10px] sm:text-xs ${
              activeTab === "all"
                ? "border-0 bg-white/10 text-white"
                : ""
            }`}
          >
            {allCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="incomplete" 
          className={`flex items-center justify-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm ${
            activeTab === "incomplete"
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Circle className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${activeTab === "incomplete" ? "text-white" : "text-orange-400"}`} />
          <span className="hidden sm:inline">Incomplete</span>
          <Badge 
            variant="outline" 
            className={`ml-0.5 sm:ml-1 h-4 sm:h-5 px-1 sm:px-1.5 text-[10px] sm:text-xs ${
              activeTab === "incomplete"
                ? "border-0 bg-white/10 text-white"
                : ""
            }`}
          >
            {incompleteCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="completed"
          className={`flex items-center justify-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm ${
            activeTab === "completed"
              ? "bg-green-500 text-white shadow-lg shadow-green-500/20 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckCircle2 className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${activeTab === "completed" ? "text-white" : "text-green-500"}`} />
          <span className="hidden sm:inline">Completed</span>
          <Badge 
            variant="outline" 
            className={`ml-0.5 sm:ml-1 h-4 sm:h-5 px-1 sm:px-1.5 text-[10px] sm:text-xs ${
              activeTab === "completed"
                ? "bg-green-500/10 text-white border-0"
                : ""
            }`}
          >
            {completedCount}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0 pt-0">
        {allContent}
      </TabsContent>

      <TabsContent value="incomplete" className="mt-0 pt-0">
        {incompleteContent}
      </TabsContent>

      <TabsContent value="completed" className="mt-0 pt-0">
        {completedContent}
      </TabsContent>
    </Tabs>
  )
}

