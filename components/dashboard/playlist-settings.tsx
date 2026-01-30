"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ChangePlaylistDialog } from "./change-playlist-dialog"

interface PlaylistSettingsProps {
  playlistUrl: string | null
}

export function PlaylistSettings({ playlistUrl }: PlaylistSettingsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className="backdrop-blur-md bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Playlist
          </CardTitle>
          <CardDescription>Manage your YouTube playlist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {playlistUrl ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Playlist</span>
                <Link
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:underline flex items-center gap-1"
                >
                  View on YouTube
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <p className="text-xs text-muted-foreground break-all bg-muted/50 p-2 rounded">
                {playlistUrl}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDialogOpen(true)}
              >
                Change Playlist
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                No playlist configured
              </p>
              <Button
                className="w-full"
                onClick={() => setDialogOpen(true)}
              >
                Add Playlist
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ChangePlaylistDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentPlaylistUrl={playlistUrl || undefined}
      />
    </>
  )
}


