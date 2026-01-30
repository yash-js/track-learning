"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Video, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetupForm() {
  const [playlistUrl, setPlaylistUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const extractPlaylistId = (url: string): string | null => {
    // Match various YouTube playlist URL formats
    const patterns = [
      /[?&]list=([a-zA-Z0-9_-]+)/, // Standard format
      /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/.*[?&]list=([a-zA-Z0-9_-]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const playlistId = extractPlaylistId(playlistUrl)

      if (!playlistId) {
        setError("Invalid YouTube playlist URL. Please provide a valid playlist link.")
        setLoading(false)
        return
      }

      const response = await fetch("/api/setup/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistUrl,
          playlistId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save playlist")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl backdrop-blur-md bg-muted/30 border-border/50">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20">
            <Video className="h-6 w-6 text-accent" />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome! Let's Get Started</CardTitle>
            <CardDescription className="text-base mt-1">
              Add your YouTube playlist to start tracking your learning progress
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playlist-url" className="text-base">
              YouTube Playlist URL
            </Label>
            <Input
              id="playlist-url"
              type="url"
              placeholder="https://www.youtube.com/playlist?list=PL..."
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              disabled={loading}
              className="h-12 text-base"
              required
            />
            <p className="text-sm text-muted-foreground">
              Paste the full URL of your YouTube playlist. You can find this by going to your
              playlist on YouTube and copying the URL from your browser.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading || !playlistUrl.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Continue to Dashboard
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

