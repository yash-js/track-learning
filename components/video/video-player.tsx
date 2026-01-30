"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface VideoPlayerProps {
  videoId: string
  title: string
  videoProgressId?: string
  userId: string
  videoIdParam: string
  watchPosition?: number | null
  nextVideoId?: string | null
  description?: string | null
}

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  getCurrentTime: () => number
}

interface YouTubeAPI {
  Player: new (elementId: string | HTMLElement, config: {
    videoId: string
    playerVars: Record<string, unknown>
    events: {
      onReady?: (event: { target: YouTubePlayer }) => void
      onStateChange?: (event: { data: number; target: YouTubePlayer }) => void
    }
  }) => YouTubePlayer
  PlayerState: {
    PAUSED: number
    ENDED: number
  }
}

declare global {
  interface Window {
    YT?: YouTubeAPI
    onYouTubeIframeAPIReady?: () => void
  }
}

export default function VideoPlayer({
  videoId,
  title,
  videoProgressId,
  userId,
  videoIdParam,
  watchPosition,
  nextVideoId,
  description,
}: VideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [player, setPlayer] = useState<YouTubePlayer | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === "undefined" || !playerRef.current) return

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer()
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      // Script is loading, wait for callback
      const originalCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (originalCallback) originalCallback()
        initializePlayer()
      }
      return
    }

    // Load the IFrame Player API script
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Set up callback
    window.onYouTubeIframeAPIReady = initializePlayer

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initializePlayer = () => {
    if (!playerRef.current || !window.YT) return

    new window.YT.Player(playerRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        rel: 0,
        start: watchPosition ? Math.floor(watchPosition) : 0,
      },
      events: {
        onReady: (event: { target: YouTubePlayer }) => {
          setPlayer(event.target)
          // Start tracking position
          startPositionTracking(event.target)
        },
        onStateChange: (event: { data: number; target: YouTubePlayer }) => {
          // Save position when video is paused or ended
          if (window.YT && (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED)) {
            savePosition(event.target.getCurrentTime())
          }
        },
      },
    })
  }
  
  // Listen for seek events from timeline
  useEffect(() => {
    const handleSeek = (e: Event) => {
      const customEvent = e as CustomEvent<number>
      if (player && typeof player.seekTo === "function") {
        player.seekTo(customEvent.detail, true)
        player.playVideo()
      }
    }
    
    const handleRequestTime = () => {
      if (player && typeof player.getCurrentTime === "function") {
        const currentTime = player.getCurrentTime()
        const event = new CustomEvent<number>("videoGetTime", { detail: currentTime })
        window.dispatchEvent(event)
      }
    }
    
    window.addEventListener("videoSeek", handleSeek)
    window.addEventListener("videoRequestTime", handleRequestTime)
    
    return () => {
      window.removeEventListener("videoSeek", handleSeek)
      window.removeEventListener("videoRequestTime", handleRequestTime)
    }
  }, [player])

  const startPositionTracking = (ytPlayer: YouTubePlayer) => {
    // Save position every 10 seconds while playing
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current)
    }

    saveIntervalRef.current = setInterval(() => {
      if (ytPlayer && ytPlayer.getCurrentTime) {
        const currentTime = ytPlayer.getCurrentTime()
        savePosition(currentTime)
      }
    }, 10000) // Save every 10 seconds

    // Save position on page unload
    const handleBeforeUnload = () => {
      if (ytPlayer && ytPlayer.getCurrentTime) {
        const currentTime = ytPlayer.getCurrentTime()
        // Use sendBeacon for reliable save on page unload
        const blob = new Blob(
          [
            JSON.stringify({
              videoId: videoIdParam,
              userId,
              videoProgressId,
              currentTime,
            }),
          ],
          { type: "application/json" }
        )
        navigator.sendBeacon("/api/video/position", blob)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
    }
  }

  const savePosition = async (currentTime: number) => {
    try {
      await fetch("/api/video/position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoIdParam,
          userId,
          videoProgressId,
          currentTime,
        }),
      })
    } catch (error) {
      console.error("Error saving video position:", error)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch("/api/video/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoIdParam,
          userId,
          videoProgressId,
        }),
      })

      if (response.ok) {
        setIsCompleted(true)
        router.refresh()
        
        // Auto-redirect to next video if available
        if (nextVideoId) {
          setTimeout(() => {
            router.push(`/dashboard/video/${nextVideoId}`)
          }, 1000) // Small delay to show completion state
        }
      }
    } catch (error) {
      console.error("Error marking video as complete:", error)
    }
  }

  return (
    <Card className="backdrop-blur-md bg-muted/30">
      <CardContent className="p-0">
        <div className="aspect-video bg-muted relative w-full">
          <div ref={playerRef} className="absolute inset-0 w-full h-full" />
        </div>
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold line-clamp-2 sm:line-clamp-none flex-1 min-w-0">
              {title}
            </h2>
            <Button
              onClick={handleComplete}
              disabled={isCompleted}
              variant={isCompleted ? "secondary" : "default"}
              className="gap-2 w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Completed</span>
                  <span className="sm:hidden">Done</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Mark as Complete</span>
                  <span className="sm:hidden">Complete</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3">
            {description || "Watch and learn from this tutorial"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

