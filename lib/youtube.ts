// This file uses Next.js caching for YouTube API calls

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export interface YouTubeVideo {
  id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
  duration: string
  position: number
}

export interface YouTubePlaylistItem {
  kind: string
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
    }
    channelTitle: string
    playlistId: string
    position: number
    resourceId: {
      kind: string
      videoId: string
    }
  }
  contentDetails: {
    videoId: string
    videoPublishedAt: string
  }
}

export interface YouTubeVideoDetails {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      high: { url: string }
    }
  }
  contentDetails: {
    duration: string
  }
}

// Format ISO 8601 duration to readable format (e.g., PT15M33S -> 15:33)
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = parseInt(match[1] || "0", 10)
  const minutes = parseInt(match[2] || "0", 10)
  const seconds = parseInt(match[3] || "0", 10)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Fetch all videos from the playlist
export async function getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YOUTUBE_API_KEY not set, returning empty array")
    return []
  }

  if (!playlistId) {
    console.warn("No playlist ID provided")
    return []
  }

  try {
    const videos: YouTubeVideo[] = []
    let nextPageToken: string | undefined = undefined

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems")
      url.searchParams.set("part", "snippet,contentDetails")
      url.searchParams.set("playlistId", playlistId)
      url.searchParams.set("maxResults", "50")
      url.searchParams.set("key", YOUTUBE_API_KEY)
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken)
      }

      const response = await fetch(url.toString(), {
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Fetch video details for duration
      const videoIds = data.items.map(
        (item: YouTubePlaylistItem) => item.contentDetails.videoId
      )

      if (videoIds.length > 0) {
        const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos")
        detailsUrl.searchParams.set("part", "contentDetails,snippet")
        detailsUrl.searchParams.set("id", videoIds.join(","))
        detailsUrl.searchParams.set("key", YOUTUBE_API_KEY)

        const detailsResponse = await fetch(detailsUrl.toString(), {
          next: { revalidate: 3600 },
        })

        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json()
          const detailsMap = new Map(
            detailsData.items.map((item: YouTubeVideoDetails) => [
              item.id,
              item,
            ])
          )

          for (const item of data.items) {
            const videoId = item.contentDetails.videoId
            const details = detailsMap.get(videoId) as YouTubeVideoDetails | undefined

            videos.push({
              id: videoId, // Use videoId as the ID for consistency
              videoId: videoId,
              title: item.snippet.title,
              description: item.snippet.description || "",
              thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || "",
              duration: details?.contentDetails?.duration
                ? formatDuration(details.contentDetails.duration)
                : "0:00",
              position: item.snippet.position,
            })
          }
        }
      }

      nextPageToken = data.nextPageToken
    } while (nextPageToken)

    // Sort by position to maintain playlist order
    return videos.sort((a, b) => a.position - b.position)
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error)
    return []
  }
}

// Get a single video by ID
export async function getVideoById(videoId: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YOUTUBE_API_KEY not set")
    return null
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos")
    url.searchParams.set("part", "snippet,contentDetails")
    url.searchParams.set("id", videoId)
    url.searchParams.set("key", YOUTUBE_API_KEY)

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return null
    }

    const item = data.items[0]

    return {
      id: videoId,
      videoId: videoId,
      title: item.snippet.title,
      description: item.snippet.description || "",
      thumbnail: item.snippet.thumbnails.high?.url || "",
      duration: item.contentDetails.duration
        ? formatDuration(item.contentDetails.duration)
        : "0:00",
      position: 0,
    }
  } catch (error) {
    console.error("Error fetching YouTube video:", error)
    return null
  }
}

