import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if a user's streak should be reset based on their last activity
 * @param lastActiveAt - The last time the user was active (null if never active)
 * @returns true if streak should be reset (more than 1 day gap), false otherwise
 */
export function shouldResetStreak(lastActiveAt: Date | null): boolean {
  if (!lastActiveAt) {
    return false // No activity yet, don't reset (will be set when first video is completed)
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastActiveDate = new Date(
    lastActiveAt.getFullYear(),
    lastActiveAt.getMonth(),
    lastActiveAt.getDate()
  )

  const daysSinceLastActive = Math.floor(
    (today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Reset streak if more than 1 day has passed since last activity
  return daysSinceLastActive > 1
}

/**
 * Calculates the new streak value based on last activity
 * @param currentStreak - Current streak value
 * @param lastActiveAt - Last activity date (null if never active)
 * @param isCompletingVideo - Whether the user is completing a video now
 * @returns The new streak value
 */
export function calculateStreak(
  currentStreak: number,
  lastActiveAt: Date | null,
  isCompletingVideo: boolean
): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastActiveDate = lastActiveAt
    ? new Date(
        lastActiveAt.getFullYear(),
        lastActiveAt.getMonth(),
        lastActiveAt.getDate()
      )
    : null

  const daysSinceLastActive = lastActiveDate
    ? Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24))
    : null

  if (daysSinceLastActive === null) {
    // First time ever - start streak at 1 if completing video, otherwise 0
    return isCompletingVideo ? 1 : 0
  } else if (daysSinceLastActive === 0) {
    // Same day - keep current streak (already got credit for today)
    return currentStreak
  } else if (daysSinceLastActive === 1) {
    // Consecutive day - increment streak if completing video
    return isCompletingVideo ? currentStreak + 1 : currentStreak
  } else {
    // Streak broken (more than 1 day gap)
    // If completing video, start new streak at 1, otherwise reset to 0
    return isCompletingVideo ? 1 : 0
  }
}

