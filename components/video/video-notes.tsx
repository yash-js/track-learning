"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Lightbulb, Trash2, Plus, Edit2, Check, X } from "lucide-react"

interface KeyTakeaway {
  id: string
  content: string
  createdAt: Date | string
}

interface VideoNotesProps {
  videoProgressId?: string
  userId: string
  videoId: string
  initialNotes: string
  previousVideoId?: string
  nextVideoId?: string
  initialTakeaways?: KeyTakeaway[]
}

export default function VideoNotes({
  videoProgressId,
  userId,
  videoId,
  initialNotes,
  previousVideoId,
  nextVideoId,
  initialTakeaways = [],
}: VideoNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)
  const [takeaways, setTakeaways] = useState<KeyTakeaway[]>(initialTakeaways)
  const [newTakeaway, setNewTakeaway] = useState("")
  const [isAddingTakeaway, setIsAddingTakeaway] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    setNotes(initialNotes)
  }, [initialNotes])

  useEffect(() => {
    setTakeaways(initialTakeaways)
  }, [initialTakeaways])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (notes !== initialNotes) {
        saveNotes()
      }
    }, 1000) // Debounce for 1 second

    return () => clearTimeout(timeoutId)
  }, [notes])

  const saveNotes = async () => {
    setIsSaving(true)
    try {
      await fetch("/api/video/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          userId,
          videoProgressId,
          notes,
        }),
      })
    } catch (error) {
      console.error("Error saving notes:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addTakeaway = async () => {
    if (!videoProgressId || !newTakeaway.trim()) return

    try {
      const response = await fetch("/api/video/takeaways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoProgressId,
          content: newTakeaway.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTakeaways([data.takeaway, ...takeaways])
        setNewTakeaway("")
        setIsAddingTakeaway(false)
      }
    } catch (error) {
      console.error("Error adding takeaway:", error)
    }
  }

  const deleteTakeaway = async (takeawayId: string) => {
    try {
      const response = await fetch(`/api/video/takeaways?takeawayId=${takeawayId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTakeaways(takeaways.filter((t) => t.id !== takeawayId))
      }
    } catch (error) {
      console.error("Error deleting takeaway:", error)
    }
  }

  const startEditing = (takeaway: KeyTakeaway) => {
    setEditingId(takeaway.id)
    setEditContent(takeaway.content)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditContent("")
  }

  const saveEdit = async (takeawayId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch("/api/video/takeaways", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          takeawayId,
          content: editContent.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTakeaways(takeaways.map((t) => (t.id === takeawayId ? data.takeaway : t)))
        setEditingId(null)
        setEditContent("")
      }
    } catch (error) {
      console.error("Error updating takeaway:", error)
    }
  }

  return (
    <Card className="backdrop-blur-md bg-muted/30">
      <CardHeader className="p-4 sm:p-6">
        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {previousVideoId ? (
            <Link href={`/dashboard/video/${previousVideoId}`} className="flex-1 sm:flex-none">
              <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
            </Link>
          ) : (
            <div className="flex-1 sm:hidden" />
          )}
          {nextVideoId ? (
            <Link href={`/dashboard/video/${nextVideoId}`} className="flex-1 sm:flex-none">
              <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex-1 sm:hidden" />
          )}
        </div>
        <CardTitle className="text-lg sm:text-xl">Notes & Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
            <TabsTrigger value="notes" className="text-xs sm:text-sm">Notes</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm">Key Takeaways</TabsTrigger>
          </TabsList>
          <TabsContent value="notes" className="mt-4">
            <div className="space-y-2">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes as you watch..."
                className="min-h-[300px] sm:min-h-[400px] resize-none bg-background/50 text-sm sm:text-base"
              />
              {isSaving && (
                <p className="text-xs text-muted-foreground">Saving...</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Save key concepts, formulas, or insights from this video
                </p>
                {!isAddingTakeaway && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingTakeaway(true)}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Takeaway</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                )}
              </div>

              {isAddingTakeaway && (
                <div className="space-y-2 p-3 border border-border/50 rounded-lg bg-muted/30">
                  <Textarea
                    placeholder="Enter a key takeaway, concept, formula, or insight..."
                    value={newTakeaway}
                    onChange={(e) => setNewTakeaway(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        addTakeaway()
                      } else if (e.key === "Escape") {
                        setIsAddingTakeaway(false)
                        setNewTakeaway("")
                      }
                    }}
                    className="min-h-[80px] resize-none text-sm sm:text-base"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addTakeaway} disabled={!newTakeaway.trim()} className="flex-1 sm:flex-none">
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAddingTakeaway(false)
                        setNewTakeaway("")
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {takeaways.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground">
                  <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                  <p>No key takeaways yet</p>
                  <p className="text-xs mt-1 hidden sm:block">Click "Add Takeaway" to save important concepts</p>
                  <p className="text-xs mt-1 sm:hidden">Tap "Add" to save concepts</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                  {takeaways.map((takeaway) => (
                    <div
                      key={takeaway.id}
                      className="p-2 sm:p-3 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      {editingId === takeaway.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[60px] resize-none text-sm sm:text-base"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveEdit(takeaway.id)}
                              disabled={!editContent.trim()}
                              className="flex-1 sm:flex-none"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditing} className="flex-1 sm:flex-none">
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="flex-1 text-xs sm:text-sm leading-relaxed break-words">{takeaway.content}</p>
                          <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(takeaway)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteTakeaway(takeaway.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

