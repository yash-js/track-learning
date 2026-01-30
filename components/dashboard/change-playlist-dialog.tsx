"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChangePlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlaylistUrl?: string
}

export function ChangePlaylistDialog({
  open,
  onOpenChange,
  currentPlaylistUrl,
}: ChangePlaylistDialogProps) {
  const [playlistUrl, setPlaylistUrl] = useState(currentPlaylistUrl || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setPlaylistUrl(currentPlaylistUrl || "")
      setError("")
      setLoading(false)
    }
  }, [open, currentPlaylistUrl])

  const extractPlaylistId = (url: string): string | null => {
    if (!url || typeof url !== "string") {
      return null
    }

    // Trim whitespace
    const trimmedUrl = url.trim()
    
    // Check if it's a YouTube URL
    if (!trimmedUrl.includes("youtube.com") && !trimmedUrl.includes("youtu.be")) {
      return null
    }

    // Match various YouTube playlist URL formats
    // Playlist IDs are alphanumeric with dashes/underscores, typically 5+ characters
    const patterns = [
      /[?&]list=([a-zA-Z0-9_-]{5,})/, // Standard format - require at least 5 chars
      /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]{5,})/,
      /youtu\.be\/.*[?&]list=([a-zA-Z0-9_-]{5,})/,
    ]

    for (const pattern of patterns) {
      const match = trimmedUrl.match(pattern)
      if (match && match[1] && match[1].length >= 5) {
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

      onOpenChange(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Change Playlist</DialogTitle>
          <DialogDescription>
            Enter a new YouTube playlist URL to update your learning playlist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-url">YouTube Playlist URL</Label>
            <Input
              id="playlist-url"
              type="url"
              placeholder="https://www.youtube.com/playlist?list=PL..."
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !playlistUrl.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Playlist"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

