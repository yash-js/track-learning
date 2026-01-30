import React from "react"

interface LearningTrackerIconProps {
  className?: string
}

export default function LearningTrackerIcon({ className = "h-5 w-5" }: LearningTrackerIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Book base - open book */}
      <path
        d="M4 19.5C4 18.6716 4.67157 18 5.5 18H19.5C20.3284 18 21 18.6716 21 19.5C21 20.3284 20.3284 21 19.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z"
        fill="currentColor"
        opacity="0.2"
      />
      
      {/* Left page */}
      <path
        d="M5 4C5 3.44772 5.44772 3 6 3H12C12.5523 3 13 3.44772 13 4V16C13 16.5523 12.5523 17 12 17H6C5.44772 17 5 16.5523 5 16V4Z"
        fill="currentColor"
        opacity="0.6"
      />
      
      {/* Right page */}
      <path
        d="M11 4C11 3.44772 11.4477 3 12 3H18C18.5523 3 19 3.44772 19 4V16C19 16.5523 18.5523 17 18 17H12C11.4477 17 11 16.5523 11 16V4Z"
        fill="currentColor"
      />
      
      {/* Progress bar on right page */}
      <rect
        x="12.5"
        y="7"
        width="5.5"
        height="2"
        rx="1"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="12.5"
        y="7"
        width="4"
        height="2"
        rx="1"
        fill="currentColor"
        className="text-primary"
      />
      
      {/* Checkmark badge */}
      <circle
        cx="17.5"
        cy="8"
        r="2.5"
        fill="currentColor"
        className="text-secondary"
      />
      <path
        d="M16.5 8L17.2 8.6L18.5 7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-background"
        fill="none"
      />
      
      {/* Additional progress indicator lines */}
      <rect
        x="12.5"
        y="11"
        width="5.5"
        height="1.5"
        rx="0.75"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="12.5"
        y="11"
        width="3"
        height="1.5"
        rx="0.75"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  )
}

