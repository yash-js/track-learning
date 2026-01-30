import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressRingsProps {
  userId: string
}

// Mock module data - in production, this would be calculated from video tags/categories
const modules = [
  { name: "Arrays", chartColor: "chart-1" },
  { name: "Recursion", chartColor: "chart-2" },
  { name: "Sorting", chartColor: "chart-3" },
  { name: "Searching", chartColor: "chart-4" },
  { name: "Trees", chartColor: "chart-5" },
  { name: "Graphs", chartColor: "chart-1" },
]

export default async function ProgressRings({}: ProgressRingsProps) {
  // In a real implementation, you'd calculate progress per module
  // For now, all modules start at 0% progress
  const moduleProgress = modules.map((module) => ({
    ...module,
    progress: 0, // Initial progress is 0%
  }))

  return (
    <Card className="backdrop-blur-md bg-muted/30">
      <CardHeader>
        <CardTitle>Module Progress</CardTitle>
        <CardDescription>Track your progress across DSA topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {moduleProgress.map((module) => (
            <div key={module.name} className="flex flex-col items-center">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90 transform">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={`oklch(var(--${module.chartColor}))`}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - module.progress / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{module.progress}%</span>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium">{module.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

